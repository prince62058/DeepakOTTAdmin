import { Col, Row } from 'react-bootstrap'
import SubAdminList from './Components/SubAdminList'
import PageTItle from '@/components/PageTItle'
export const metadata = {
  title: 'Sub Admin List',
}
const SubAdminListPage = () => {
  return (
    <>
      <PageTItle title="SUB ADMIN LIST" />
      <Row>
        <Col xl={12}>
          <SubAdminList />
        </Col>
      </Row>
    </>
  )
}
export default SubAdminListPage
