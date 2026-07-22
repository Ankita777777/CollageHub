import {
  Box, Table, TableBody, TableCell, TableHead,
  TableRow, Typography, CircularProgress,
  useMediaQuery, useTheme
} from '@mui/material'

const DataTable = ({ columns, rows, loading, emptyMessage = 'No data found' }) => {
  const theme    = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  if (loading) {
    return (
      <Box textAlign="center" py={6}>
        <CircularProgress />
      </Box>
    )
  }

  if (rows.length === 0) {
    return (
      <Typography textAlign="center" color="text.secondary" py={6}>
        {emptyMessage}
      </Typography>
    )
  }

  return (
    <Box sx={{ overflowX: 'auto' }}>
      <Table size={isMobile ? 'small' : 'medium'}>
        <TableHead>
          <TableRow>
            {columns.map((col) => (
              <TableCell
                key={col.key}
                sx={{
                  display: col.hideOnMobile && isMobile ? 'none' : 'table-cell',
                  fontWeight: 700, fontSize: 13,
                }}
              >
                {col.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, i) => (
            <TableRow key={i} hover>
              {columns.map((col) => (
                <TableCell
                  key={col.key}
                  sx={{ display: col.hideOnMobile && isMobile ? 'none' : 'table-cell' }}
                >
                  {col.render ? col.render(row) : row[col.key]}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  )
}

export default DataTable