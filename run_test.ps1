$dbServer = "."
$dbName = "DaNangSafeFood"
$sqlFile = "d:\workspace\NAM-3\DAPM\DaNang-SafeFood\test_approval_workflow.sql"

try {
    # Connect to SQL Server and execute script
    $connection = New-Object System.Data.SqlClient.SqlConnection
    $connection.ConnectionString = "Server=$dbServer;Database=$dbName;Integrated Security=true;Encrypt=false"
    $connection.Open()
    
    # Read SQL script
    $sqlContent = Get-Content $sqlFile -Raw
    
    # Split by GO statement (case-insensitive)
    $sqlStatements = $sqlContent -split "(?i)^\s*GO\s*`$" | Where-Object { $_.Trim().Length -gt 0 }
    
    foreach ($statement in $sqlStatements) {
        if ($statement.Trim()) {
            Write-Host "Executing batch..."
            
            $cmd = New-Object System.Data.SqlClient.SqlCommand($statement, $connection)
            $cmd.CommandTimeout = 60
            
            # Use ExecuteNonQuery for non-SELECT statements, ExecuteReader for SELECT
            try {
                $result = $cmd.ExecuteReader()
                
                # Read and display results
                if ($result.HasRows) {
                    while ($result.Read()) {
                        for ($i = 0; $i -lt $result.FieldCount; $i++) {
                            Write-Host "$($result.GetName($i)): $($result.GetValue($i))"
                        }
                        Write-Host ""
                    }
                }
                
                $result.Close()
            }
            catch {
                # Try as non-query
                $cmd.ExecuteNonQuery() | Out-Null
            }
        }
    }
    
    $connection.Close()
    Write-Host "Test completed successfully"
}
catch {
    Write-Host "Error: $_"
    if ($_.Exception.InnerException) {
        Write-Host "Inner: $($_.Exception.InnerException.Message)"
    }
}
