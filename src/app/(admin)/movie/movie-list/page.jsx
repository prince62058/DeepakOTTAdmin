import { Col, Row } from 'react-bootstrap'
import MovieList from './Components/MovieList'
import PageTItle from '@/components/PageTItle'
export const metadata = {
  title: 'Movies List',
}
const GenreListPage = () => {
  return (
    <>
      <PageTItle title="Movie LIST" />
      <Row>
        <Col xl={12}>
          <MovieList />
        </Col>
      </Row>
    </>
  )
}
export default GenreListPage
