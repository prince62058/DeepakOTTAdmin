import { Col, Row } from 'react-bootstrap'
import LanguageList from './Components/LanguageList'
import PageTItle from '@/components/PageTItle'
export const metadata = {
  title: 'Language List',
}
const LanguageListPage = () => {
  return (
    <>
      <PageTItle title="LANGUAGE LIST" />
      <Row>
        <Col xl={12}>
          <LanguageList />
        </Col>
      </Row>
    </>
  )
}
export default LanguageListPage
