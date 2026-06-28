import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchFeeStatus } from '../../../features/student/studentSlice'
import {
  Box, Card, CardContent, Typography, Table, TableHead,
  TableRow, TableCell, TableBody, Chip, Button,
  CircularProgress, Alert, Grid
} from '@mui/material'
import PaymentIcon    from '@mui/icons-material/Payment'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import Layout from '../../../components/Layout'

const Fee = () => {
  const dispatch = useDispatch()
  const { fee, loading } = useSelector((state) => state.student)

  useEffect(() => {
    dispatch(fetchFeeStatus())
  }, [dispatch])

  const statusColor = {
    paid:    'success',
    due:     'error',
    partial: 'warning',
  }

  return (
    <Layout role="student">
      <Typography variant="h5" fontWeight={700} mb={3}>Fee Management</Typography>

      {loading ? (
        <Box textAlign="center" py={6}><CircularProgress /></Box>
      ) : (
        <>
          {/* Status Banner */}
          <Alert
            severity={fee.feeStatus === 'paid' ? 'success' : 'warning'}
            icon={fee.feeStatus === 'paid' ? <CheckCircleIcon /> : <PaymentIcon />}
            sx={{ mb: 3, fontSize: 16 }}
          >
            {fee.feeStatus === 'paid'
              ? 'All fees are cleared. You are up to date!'
              : `Your fee status is "${fee.feeStatus}". Please clear dues.`}
          </Alert>

          {/* Summary */}
          <Grid container spacing={3} mb={4}>
            {[
              {
                label: 'Total Paid',
                value: `Rs. ${fee.payments?.filter((p) => p.status === 'completed').reduce((s, p) => s + p.amount, 0) || 0}`,
              },
              {
                label: 'Pending Payments',
                value: fee.payments?.filter((p) => p.status === 'pending').length || 0,
              },
              {
                label: 'Fee Status',
                value: fee.feeStatus || '-',
              },
            ].map((s) => (
              <Grid item xs={12} sm={4} key={s.label}>
                <Card>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Typography variant="h5" fontWeight={700} color="primary.main">
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
                  <Button variant="contained" startIcon={<PaymentIcon />}>
                    Pay Now (eSewa)
                  </Button>
                )}
              </Box>
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
                    <TableRow key={p._id}>
                      <TableCell>{p.receiptNo}</TableCell>
                      <TableCell>Sem {p.semester}</TableCell>
                      <TableCell>Rs. {p.amount}</TableCell>
                      <TableCell sx={{ textTransform: 'capitalize' }}>{p.method}</TableCell>
                      <TableCell>
                        <Chip
                          label={p.status}
                          size="small"
                          color={
                            p.status === 'completed' ? 'success' :
                            p.status === 'pending'   ? 'warning' : 'error'
                          }
                        />
                      </TableCell>
                      <TableCell>
                        {p.paidAt ? new Date(p.paidAt).toLocaleDateString() : '-'}
                      </TableCell>
                    </TableRow>
                  ))}
                  {!fee.payments?.length && (
                    <TableRow>
                      <TableCell colSpan={6} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                        No payment records found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </>
      )}
    </Layout>
  )
}

export default Fee