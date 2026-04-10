using MineSweeperServer.DTOs;

namespace MineSweeperServer.Services;

public class LeaderBoardHandler
{
    private readonly List<LeaderboardEntry> _leaderBoard = new();

    private void SetScore(string playerName, int time) => _leaderBoard.Add(new LeaderboardEntry(playerName, time));

    public void AddScore(string playerName, int time)
    {
        ValidateEntry(new LeaderboardEntry(playerName, time));
        SetScore(playerName, time);
    }

    public List<LeaderboardEntry> GetTop10()
    {
        var sortedLeaderBoard = _leaderBoard.OrderBy(entry => entry.TimeInSeconds).Take(10).ToList();
        return sortedLeaderBoard;
    }

    private void ValidateEntry(LeaderboardEntry entry)
    {
        if (string.IsNullOrWhiteSpace(entry.PlayerName))
        {
            throw new ArgumentException("Player name cannot be empty.");
        }
        if (entry.TimeInSeconds <= 0)
        {
            throw new ArgumentException("Time in seconds must be positive.");
        }
    }


}
