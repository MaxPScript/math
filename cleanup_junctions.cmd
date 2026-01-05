:: Recursively delete all NTFS junctions from this folder downwards
:: WARNING: Run as Admin. Does not delete actual source data, only the links.

@echo off
echo === Junction cleanup started ===
echo.

for /D /R %%J in (*) do (
    fsutil reparsepoint query "%%J" >nul 2>&1
    if not errorlevel 1 (
        rmdir "%%J"
    )
)

echo.
echo === Junction cleanup finished ===
pause
