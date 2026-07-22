import { toast } from 'react-toastify'

const useToast = () => {
  const success = (msg) => toast.success(msg)
  const error   = (msg) => toast.error(msg)
  const info    = (msg) => toast.info(msg)
  const warning = (msg) => toast.warning(msg)

  return { success, error, info, warning }
}

export default useToast