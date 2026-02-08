import { Col, Row } from 'react-bootstrap'
import SubscriptionList from './Components/SubscriptionList'
import PageTItle from '@/components/PageTItle'
export const metadata = {
  title: 'Subscription List',
}
const SubscriptionListPage = () => {
  return (
    <>
      <PageTItle title="SUBSCRIPTION LIST" />
      <Row>
        <Col xl={12}>
          <SubscriptionList />
        </Col>
      </Row>
    </>
  )
}
export default SubscriptionListPage
