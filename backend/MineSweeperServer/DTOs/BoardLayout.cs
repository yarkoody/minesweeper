namespace MineSweeperServer.DTOs;

public record BoardLayout(int Rows, int Cols, List<MinePosition> MinePositions);
