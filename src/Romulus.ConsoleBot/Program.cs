using Serilog;
using Serilog.Events;

namespace Romulus.ConsoleBot
{
    class Program
    {
        public static void Main(string[] args)
        {
            Log.Logger = new LoggerConfiguration()
           .MinimumLevel.Debug()
           .MinimumLevel.Override("Microsoft", LogEventLevel.Information)
           .Enrich.FromLogContext()
           .WriteTo.Console()
           .CreateLogger();

            Startup.RunAsync(args).GetAwaiter().GetResult();
        }
    }
}
