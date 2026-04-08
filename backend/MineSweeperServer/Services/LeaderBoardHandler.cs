namespace MineSweeperServer.Services;

public class LeaderBoardHandler
{
    private readonly List<(string playerName, DateTime time)> _leaderBoard = new();

    private void SetScore(string playerName, DateTime time) => _leaderBoard.Add((playerName, time));

    public void AddScore(string playerName, DateTime time)
    {
        SetScore(playerName, time);
    }

    public List<(string playerName, DateTime time)> GetTop10()
    {
        var sortedLeaderBoard = _leaderBoard.OrderBy(entry => entry.time).Take(10).ToList();
        return sortedLeaderBoard;
    }


}
