#See https://aka.ms/containerfastmode to understand how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/aspnet:5.0-buster-slim AS base
ENV TZ=Europe/Warsaw
WORKDIR /app

FROM mcr.microsoft.com/dotnet/sdk:5.0-buster-slim AS build
WORKDIR /src
COPY ["src/Romulus.ConsoleBot/Romulus.ConsoleBot.csproj", "src/Romulus.ConsoleBot/"]
COPY ["NuGet.Config", ""]
RUN dotnet restore "src/Romulus.ConsoleBot/Romulus.ConsoleBot.csproj"
COPY . .
WORKDIR "/src/src/Romulus.ConsoleBot"
RUN dotnet build "Romulus.ConsoleBot.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "Romulus.ConsoleBot.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Romulus.ConsoleBot.dll"]