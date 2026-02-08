import { Row } from 'react-bootstrap'
import Stats from './components/Stats'
import Conversions from './components/Conversions'
import Orders from './components/Orders'
import PageTItle from '@/components/PageTItle'

const DashboardClient = () => {
  return (
    <Row>
      {/* <PageTItle title="Dashboard" /> */}
      <Stats />
      {/* <Conversions /> */}
      {/* <Orders /> */}
    </Row>
  )
}

export default DashboardClient
