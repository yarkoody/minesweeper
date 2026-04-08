using MineSweeperServer.DTOs;

namespace MineSweeperServer.Services;

public class BoardProvider(int rows, int cols, int numMines)
{

    public BoardLayout GenerateRandomBoard()
    {
        ValidateBoard(rows, cols, numMines);

        var minePositions = new HashSet<(int Row, int Col)>();
        var rnd = new Random();
        while (minePositions.Count < numMines)
        {
            int row = rnd.Next(rows);
            int col = rnd.Next(cols);

            minePositions.Add((row, col));
        }
        var minePosDTOs = minePositions.Select(mPos => new MinePosition(mPos.Row, mPos.Col)).ToList();
        return new BoardLayout(rows, cols, minePosDTOs);

    }

    private void ValidateBoard(int rows, int cols, int numMines)
    {
        if (rows <= 0 || cols <= 0)
        {
            throw new ArgumentException("Rows and columns must be positive integers.");
        }
        if (numMines < 0 || numMines >= rows * cols)
        {
            throw new ArgumentException("Number of mines must be non-negative and less than total cells.");
        }
    }
}