import { useState, useCallback } from 'react'
import API from '../api/axios'
import { toast } from 'react-toastify'

const useApi = () => {
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState(null)

  const request = useCallback(async ({
    method  = 'get',
    url,
    data    = null,
    params  = null,
    headers = {},
    onSuccess,
    successMsg,
    errorMsg,
  }) => {
    setLoading(true)
    setError(null)
    try {
      const config = { params, headers }
      let res

      if (method === 'get')    res = await API.get(url, config)
      if (method === 'post')   res = await API.post(url, data, config)
      if (method === 'put')    res = await API.put(url, data, config)
      if (method === 'delete') res = await API.delete(url, config)

      if (successMsg) toast.success(successMsg)
      if (onSuccess)  onSuccess(res.data)
      return res.data
    } catch (err) {
      const msg = err.response?.data?.message || errorMsg || 'Something went wrong'
      setError(msg)
      toast.error(msg)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  return { loading, error, request }
}

export default useApi