using AutoMapper;
using Discord;
using Discord.Commands;
using Discord.WebSocket;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Quartz;
using Quartz.Impl;
using Romulus.ConsoleBot.APIClients;
using Romulus.ConsoleBot.Database;
using Romulus.ConsoleBot.QuartzJobs;
using Romulus.ConsoleBot.Services;
using Serilog;
using System;
using System.Globalization;
using System.IO;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;

namespace Romulus.ConsoleBot
{
    public class Startup
    {
        public IConfiguration Configuration { get; }

        public Startup(string[] args)
        {
            var cultureInfo = new CultureInfo("en-US");
            CultureInfo.DefaultThreadCurrentCulture = cultureInfo;
            CultureInfo.DefaultThreadCurrentUICulture = cultureInfo;
            var builder = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
                .AddUserSecrets<Program>()
                .AddEnvironmentVariables();
            Configuration = builder.Build();
        }

        public static async Task RunAsync(string[] args)
        {
            var startup = new Startup(args);
            await startup.RunAsync();
        }

        public async Task RunAsync()
        {
            var services = new ServiceCollection();
            ConfigureServices(services);

            var provider = services.BuildServiceProvider();
            provider.GetRequiredService<LoggingService>();
            provider.GetRequiredService<CommandHandler>();
            await provider.GetRequiredService<StartupService>().StartAsync();

            await StartJobs(provider);

            await Task.Delay(-1);
        }

        private async Task StartJobs(IServiceProvider provider)
        {
            ILoggerFactory loggerFactory = provider.GetRequiredService<ILoggerFactory>();
            Quartz.Logging.LogContext.SetCurrentLogProvider(loggerFactory);

            var factory = new StdSchedulerFactory();
            var jobFactory = new JobFactory(provider);
            IScheduler scheduler = await factory.GetScheduler();
            scheduler.JobFactory = jobFactory;

            IJobDetail job = JobBuilder.Create<BirthdayJob>()
                .WithIdentity("BirthdayJob")
                .Build();

            ITrigger trigger = TriggerBuilder.Create()
                .WithIdentity("Daily 8AM trigger")
                .WithSchedule(CronScheduleBuilder.DailyAtHourAndMinute(8, 0))
                .Build();

            await scheduler.ScheduleJob(job, trigger);
            await scheduler.Start();
        }

        private void ConfigureServices(IServiceCollection services)
        {
            services
                .AddLogging(configure => configure.AddSerilog())
                .AddAutoMapper(c => c.AddProfile<AutoMapping>(), typeof(Profile))
                .AddSingleton(Configuration)
                .AddSingleton(new DiscordSocketClient(new DiscordSocketConfig
                {
                    LogLevel = LogSeverity.Verbose,
                    MessageCacheSize = 1000,
                    AlwaysDownloadUsers = true
                }))
                .AddSingleton(new CommandService(new CommandServiceConfig
                {
                    LogLevel = LogSeverity.Verbose,
                    DefaultRunMode = RunMode.Async,
                }))
                .AddSingleton<CommandHandler>()
                .AddSingleton<StartupService>()
                .AddSingleton<LoggingService>()
                .AddSingleton<IMongoDbHelper, MongoDbHelper>()
                .AddScoped<IOpenWeatherMapClient, OpenWeatherMapClient>()
                .AddScoped<IMapboxClient, MapboxClient>()
                .AddScoped<IMapboxService, MapboxService>()
                .AddScoped<IWeatherService, WeatherService>()
                .AddScoped<IBirthdayService, BirthdayService>()
                .AddTransient<BirthdayJob>();

        }
    }
}
