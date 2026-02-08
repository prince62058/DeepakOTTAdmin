import { Col, Row } from 'react-bootstrap'
import FaqList from './Components/FaqList'
import PageTItle from '@/components/PageTItle'
export const metadata = {
  title: 'Faq List',
}
const FaqListPage = () => {
  return (
    <>
      <PageTItle title="FAQ LIST" />
      <Row>
        <Col xl={12}>
          <FaqList />
        </Col>
      </Row>
    </>
  )
}
export default FaqListPage
