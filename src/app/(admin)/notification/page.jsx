import { Col, Row } from 'react-bootstrap'
import NotificationForm from './Components/NotificationForm'
import PageTItle from '@/components/PageTItle'
export const metadata = {
  title: 'Notification Page',
}
const NotificationPage = () => {
  return (
    <>
      <PageTItle title="Notification Page" />
      <Row>
        <Col xl={12}>
          <NotificationForm />
        </Col>
      </Row>
    </>
  )
}
export default NotificationPage
