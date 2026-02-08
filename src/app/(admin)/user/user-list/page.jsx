import { Col, Row } from 'react-bootstrap'
import UserList from './Components/UserList'
import PageTItle from '@/components/PageTItle'
export const metadata = {
  title: 'User List',
}
const UserListPage = () => {
  return (
    <>
      <PageTItle title="USER LIST" />
      <Row>
        <Col xl={12}>
          <UserList />
        </Col>
      </Row>
    </>
  )
}
export default UserListPage
