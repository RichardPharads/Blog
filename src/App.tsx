import { Provider } from 'react-redux'

import {store} from './store/store'
import AppContent from './components/AppContents'
export default function App() {
  return (
    <Provider store={store}>
      <AppContent/>
    </Provider>
  )
}