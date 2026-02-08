import { Col, Row } from 'react-bootstrap'
import TransactionList from './Components/TransactionList'
import PageTItle from '@/components/PageTItle'
export const metadata = {
  title: 'Transaction List',
}
const TransactionListPage = () => {
  return (
    <>
      <PageTItle title="TRANSACTION LIST" />
      <Row>
        <Col xl={12}>
          <TransactionList />
        </Col>
      </Row>
    </>
  )
}
export default TransactionListPage
