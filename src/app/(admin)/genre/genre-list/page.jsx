import { Col, Row } from 'react-bootstrap'
import GenreList from './Components/GenreList'
import PageTItle from '@/components/PageTItle'
export const metadata = {
  title: 'Genre List',
}
const GenreListPage = () => {
  return (
    <>
      <PageTItle title="GENRE LIST" />
      <Row>
        <Col xl={12}>
          <GenreList />
        </Col>
      </Row>
    </>
  )
}
export default GenreListPage
