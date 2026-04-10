using MineSweeperServer.DTOs;
using MineSweeperServer.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddPolicy(name: "AllowLocal",
        policy =>
        {
            policy.WithOrigins("http://localhost:5173")
                .AllowAnyHeader()
                .AllowAnyMethod();
        });
});

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();
builder.Services.AddSingleton(new BoardProvider(9, 9, 3));
builder.Services.AddSingleton<LeaderBoardHandler>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();
app.UseCors("AllowLocal");

app.MapPost("/game/start", (BoardProvider provider) =>
{
    var board = provider.GenerateRandomBoard();
    return Results.Ok(board);
});

app.MapGet("/game/leaderboard", (LeaderBoardHandler handler) =>
{
    var top10 = handler.GetTop10();
    return Results.Ok(top10);
});

app.MapPost("/game/leaderboard", (LeaderBoardHandler handler, LeaderboardEntry entry) =>
{
    try
    {
        handler.AddScore(entry.PlayerName, entry.TimeInSeconds);
    }
    catch (ArgumentException ex)
    {
        return Results.BadRequest(ex.Message);
    }

    return Results.Ok();
});

app.Run();

