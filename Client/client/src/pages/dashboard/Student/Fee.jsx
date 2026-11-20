import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchFeeStatus } from '../../../features/student/studentSlice'
import {
  Box, Card, CardContent, Typography, Table, TableHead,
  TableRow, TableCell, TableBody, Chip, Button,
  CircularProgress, Alert, Grid
} from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import WarningIcon     from '@mui/icons-material/Warning'
import PaymentIcon     from '@mui/icons-material/Payment'
import Layout from '../../../components/Layout'

const Fee = () => {
  const dispatch = useDispatch()
  const { fee, loading, error } = useSelector((state) => state.student)

  useEffect(() => { dispatch(fetchFeeStatus()) }, [dispatch])

  const totalPaid = fee.payments
    ?.filter((p) => p.status === 'completed')
    .reduce((s, p) => s + p.amount, 0) || 0

  return (
    <Layout role="student">
      <Typography variant="h5" fontWeight={700} mb={3}>Fee Management</Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {loading ? (
        <Box textAlign="center" py={6}><CircularProgress /></Box>
      ) : (
        <>
          {/* Status Banner */}
          <Alert
            severity={fee.feeStatus === 'paid' ? 'success' : 'warning'}
            icon={fee.feeStatus === 'paid' ? <CheckCircleIcon /> : <WarningIcon />}
            sx={{ mb: 3, fontSize: 15 }}
          >
            {fee.feeStatus === 'paid'
              ? '✅ All fees cleared. You are up to date!'
              : `⚠️ Fee status: "${fee.feeStatus}". Please clear dues.`
            }
          </Alert>

          {/* Stats */}
          <Grid container spacing={2} mb={3}>
            {[
              { label: 'Fee Status',      value: fee.feeStatus || 'due',  color: fee.feeStatus === 'paid' ? '#2E7D32' : '#C62828' },
              { label: 'Total Paid',      value: `Rs. ${totalPaid}`,       color: '#1565C0' },
              { label: 'Total Payments',  value: fee.payments?.length || 0, color: '#E65100' },
            ].map((s) => (
              <Grid item xs={12} sm={4} key={s.label}>
                <Card>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Typography variant="h5" fontWeight={800} sx={{ color: s.color }}>
                      {s.value}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">{s.label}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Payment History */}
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" fontWeight={600}>Payment History</Typography>
                {fee.feeStatus !== 'paid' && (
                  <Button variant="contained" startIcon={<PaymentIcon />} size="small">
                    Pay Now
                  </Button>
                )}
              </Box>
              <Box sx={{ overflowX: 'auto' }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell><strong>Receipt No</strong></TableCell>
                      <TableCell><strong>Semester</strong></TableCell>
                      <TableCell><strong>Amount</strong></TableCell>
                      <TableCell><strong>Method</strong></TableCell>
                      <TableCell><strong>Status</strong></TableCell>
                      <TableCell><strong>Date</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {fee.payments?.map((p) => (
                      <TableRow key={p._id} hover>
                        <TableCell>{p.receiptNo}</TableCell>
                        <TableCell>Sem {p.semester}</TableCell>
                        <TableCell><strong>Rs. {p.amount}</strong></TableCell>
                        <TableCell sx={{ textTransform: 'capitalize' }}>{p.method}</TableCell>
                        <TableCell>
                          <Chip
                            label={p.status}
                            size="small"
                            color={p.status === 'completed' ? 'success' : p.status === 'pending' ? 'warning' : 'error'}
                          />
                        </TableCell>
                        <TableCell>
                          {p.paidAt ? new Date(p.paidAt).toLocaleDateString() : '—'}
                        </TableCell>
                      </TableRow>
                    ))}
                    {!fee.payments?.length && (
                      <TableRow>
                        <TableCell colSpan={6} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                          No payment records
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </Box>
            </CardContent>
          </Card>
        </>
      )}
    </Layout>
  )
}

export default Fee