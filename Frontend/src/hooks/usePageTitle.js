import { useEffect } from 'react'

function usePageTitle(title) {
  useEffect(() => {
    if (!title) {
      return
    }

    document.title = title
  }, [title])
}

export default usePageTitle
