import { Col, Row } from 'react-bootstrap'
import CompanyForm from './Components/CompanyForm'
import PageTItle from '@/components/PageTItle'
export const metadata = {
  title: 'Company Details',
}
const CompanyDetailsPage = () => {
  return (
    <>
      <PageTItle title="Company Details" />
      <Row>
        <Col xl={12}>
          <CompanyForm />
        </Col>
      </Row>
    </>
  )
}
export default CompanyDetailsPage
