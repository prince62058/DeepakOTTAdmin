'use client'

import IconifyIcon from '@/components/wrappers/IconifyIcon'
import ReactApexChart from 'react-apexcharts'
import { Card, CardBody, CardFooter, CardTitle, Col, Form, Row } from 'react-bootstrap'
import { useGetDashboardQuery } from '@/lib/api'
import { useState } from 'react'

const Stats = () => {
  const today = new Date().toISOString().split('T')[0]

  const [date, setDate] = useState({
    startDate: today,
    endDate: today,
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setDate((prev) => ({ ...prev, [name]: value }))
  }

  const { data: dashboardData } = useGetDashboardQuery({ startDate: date.startDate, endDate: date.endDate })

  const dailyOptions = {
    series: [
      {
        name: 'Watch Min.',
        type: 'bar',
        data: dashboardData?.data?.trends?.daily?.length > 0 ? dashboardData?.data?.trends?.daily?.map((ele) => ele?.totalWatchMinutes) : [],
      },
      {
        name: 'Views',
        type: 'area',
        data: dashboardData?.data?.trends?.daily?.length > 0 ? dashboardData?.data?.trends?.daily?.map((ele) => ele?.totalViews) : [],
      },
    ],
    chart: {
      height: 313,
      type: 'line',
      toolbar: {
        show: false,
      },
    },
    stroke: {
      dashArray: [0, 0],
      width: [0, 2],
      curve: 'smooth',
    },
    fill: {
      opacity: [1, 1],
      type: ['solid', 'gradient'],
      gradient: {
        type: 'vertical',
        inverseColors: false,
        opacityFrom: 0.5,
        opacityTo: 0,
        stops: [0, 90],
      },
    },
    markers: {
      size: [0, 0],
      strokeWidth: 2,
      hover: {
        size: 4,
      },
    },
    xaxis: {
      categories:
        dashboardData?.data?.trends?.daily?.length > 0
          ? dashboardData?.data?.trends?.daily?.map((ele) => ele?._id)
          : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      axisTicks: {
        show: false,
      },
      axisBorder: {
        show: false,
      },
    },
    yaxis: {
      min: 0,
      axisBorder: {
        show: false,
      },
    },
    grid: {
      show: true,
      strokeDashArray: 3,
      xaxis: {
        lines: {
          show: false,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
      padding: {
        top: 0,
        right: -2,
        bottom: 0,
        left: 10,
      },
    },
    legend: {
      show: true,
      horizontalAlign: 'center',
      offsetX: 0,
      offsetY: 5,
      markers: {
        width: 9,
        height: 9,
        radius: 6,
      },
      itemMargin: {
        horizontal: 10,
        vertical: 0,
      },
    },
    plotOptions: {
      bar: {
        columnWidth: '30%',
        barHeight: '70%',
        borderRadius: 3,
      },
    },
    colors: ['#ff6c2f', '#22c55e'],
    tooltip: {
      shared: true,
      y: [
        {
          formatter: function (y) {
            if (typeof y !== 'undefined') {
              return y.toFixed(1)
            }
            return y
          },
        },
        {
          formatter: function (y) {
            if (typeof y !== 'undefined') {
              return y.toFixed(1)
            }
            return y
          },
        },
      ],
    },
  }

  const revenueOptions = {
    series: [
      {
        name: 'Credit',
        type: 'bar',
        data: dashboardData?.data?.trends?.revenue?.length > 0 ? dashboardData?.data?.trends?.revenue?.map((ele) => ele?.totalCredit) : [],
      },
      {
        name: 'Debit',
        type: 'area',
        data: dashboardData?.data?.trends?.revenue?.length > 0 ? dashboardData?.data?.trends?.revenue?.map((ele) => ele?.totalDebit) : [],
      },
      {
        name: 'Transaction',
        type: 'area',
        data: dashboardData?.data?.trends?.revenue?.length > 0 ? dashboardData?.data?.trends?.revenue?.map((ele) => ele?.transactionCount) : [],
      },
    ],
    chart: {
      height: 313,
      type: 'line',
      toolbar: {
        show: false,
      },
    },
    stroke: {
      dashArray: [0, 0],
      width: [0, 2],
      curve: 'smooth',
    },
    fill: {
      opacity: [1, 1],
      type: ['solid', 'gradient'],
      gradient: {
        type: 'vertical',
        inverseColors: false,
        opacityFrom: 0.5,
        opacityTo: 0,
        stops: [0, 90],
      },
    },
    markers: {
      size: [0, 0],
      strokeWidth: 2,
      hover: {
        size: 4,
      },
    },
    xaxis: {
      categories:
        dashboardData?.data?.trends?.revenue?.length > 0
          ? dashboardData?.data?.trends?.revenue?.map((ele) => ele?._id)
          : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      axisTicks: {
        show: false,
      },
      axisBorder: {
        show: false,
      },
    },
    yaxis: {
      min: 0,
      axisBorder: {
        show: false,
      },
    },
    grid: {
      show: true,
      strokeDashArray: 3,
      xaxis: {
        lines: {
          show: false,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
      padding: {
        top: 0,
        right: -2,
        bottom: 0,
        left: 10,
      },
    },
    legend: {
      show: true,
      horizontalAlign: 'center',
      offsetX: 0,
      offsetY: 5,
      markers: {
        width: 9,
        height: 9,
        radius: 6,
      },
      itemMargin: {
        horizontal: 10,
        vertical: 0,
      },
    },
    plotOptions: {
      bar: {
        columnWidth: '30%',
        barHeight: '70%',
        borderRadius: 3,
      },
    },
    colors: ['#ff6c2f', '#22c55e'],
    tooltip: {
      shared: true,
      y: [
        {
          formatter: function (y) {
            if (typeof y !== 'undefined') {
              return y.toFixed(1)
            }
            return y
          },
        },
        {
          formatter: function (y) {
            if (typeof y !== 'undefined') {
              return y.toFixed(1)
            }
            return y
          },
        },
      ],
    },
  }

  const userOptions = {
    series: [
      {
        name: 'New User Growth',
        type: 'bar',
        data: dashboardData?.data?.trends?.userGrowth?.length > 0 ? dashboardData?.data?.trends?.userGrowth?.map((ele) => ele?.newUsers) : [],
      },
      // {
      //   name: 'Clicks',
      //   type: 'area',
      //   data: [8, 12, 7, 17, 21, 11, 5, 9, 7, 29, 12, 35],
      // },
    ],
    chart: {
      height: 313,
      type: 'line',
      toolbar: {
        show: false,
      },
    },
    stroke: {
      dashArray: [0, 0],
      width: [0, 2],
      curve: 'smooth',
    },
    fill: {
      opacity: [1, 1],
      type: ['solid', 'gradient'],
      gradient: {
        type: 'vertical',
        inverseColors: false,
        opacityFrom: 0.5,
        opacityTo: 0,
        stops: [0, 90],
      },
    },
    markers: {
      size: [0, 0],
      strokeWidth: 2,
      hover: {
        size: 4,
      },
    },
    xaxis: {
      categories:
        dashboardData?.data?.trends?.userGrowth?.length > 0
          ? dashboardData?.data?.trends?.userGrowth?.map((ele) => ele?._id)
          : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      axisTicks: {
        show: false,
      },
      axisBorder: {
        show: false,
      },
    },
    yaxis: {
      min: 0,
      axisBorder: {
        show: false,
      },
    },
    grid: {
      show: true,
      strokeDashArray: 3,
      xaxis: {
        lines: {
          show: false,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
      padding: {
        top: 0,
        right: -2,
        bottom: 0,
        left: 10,
      },
    },
    legend: {
      show: true,
      horizontalAlign: 'center',
      offsetX: 0,
      offsetY: 5,
      markers: {
        width: 9,
        height: 9,
        radius: 6,
      },
      itemMargin: {
        horizontal: 10,
        vertical: 0,
      },
    },
    plotOptions: {
      bar: {
        columnWidth: '30%',
        barHeight: '70%',
        borderRadius: 3,
      },
    },
    colors: ['#ff6c2f', '#22c55e'],
    tooltip: {
      shared: true,
      y: [
        {
          formatter: function (y) {
            if (typeof y !== 'undefined') {
              return y.toFixed(1)
            }
            return y
          },
        },
        {
          formatter: function (y) {
            if (typeof y !== 'undefined') {
              return y.toFixed(1)
            }
            return y
          },
        },
      ],
    },
  }
  return (
    <>
      <Col xxl={12}>
        <Row>
          <Col xs={3}>
            <Form.Group className="mb-3" controlId="startDate">
              <Form.Label>Start Date</Form.Label>
              <Form.Control
                type="date"
                name="startDate"
                value={date.startDate}
                onChange={handleChange}
                placeholder="Select start date"
                max={date.endDate || undefined} // optional: prevent selecting after end date
              />
            </Form.Group>
          </Col>

          <Col xs={3}>
            <Form.Group className="mb-3" controlId="endDate">
              <Form.Label>End Date</Form.Label>
              <Form.Control
                type="date"
                name="endDate"
                value={date.endDate}
                onChange={handleChange}
                placeholder="Select end date"
                min={date.startDate || undefined} // optional: prevent selecting before start date
              />
            </Form.Group>
          </Col>
        </Row>
      </Col>
      <Col xxl={12}>
        <Row>
          <Col xs={12}>
            <div className="alert alert-primary text-truncate mb-3" role="alert">
              User Analytics
            </div>
          </Col>
          <Col md={3}>
            <Card className="overflow-hidden">
              <CardBody>
                <Row>
                  <Col xs={6}>
                    <div className="avatar-md bg-soft-primary rounded  flex-centered">
                      <IconifyIcon icon="solar:user-rounded-line-duotone" className=" fs-24 text-primary" />
                    </div>
                  </Col>
                  <Col xs={6} className="text-end">
                    <p className="text-muted mb-0 text-truncate">User</p>
                    <h3 className="text-dark mt-1 mb-0">{dashboardData?.data?.users?.total}</h3>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="overflow-hidden">
              <CardBody>
                <Row>
                  <Col xs={6}>
                    <div className="avatar-md bg-soft-primary rounded  flex-centered">
                      <IconifyIcon icon="solar:user-speak-line-duotone" className=" fs-24 text-primary" />
                    </div>
                  </Col>
                  <Col xs={6} className="text-end">
                    <p className="text-muted mb-0 text-truncate">Active</p>
                    <h3 className="text-dark mt-1 mb-0">{dashboardData?.data?.users?.active}</h3>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="overflow-hidden">
              <CardBody>
                <Row>
                  <Col xs={6}>
                    <div className="avatar-md bg-soft-primary rounded  flex-centered">
                      <IconifyIcon icon="solar:user-hand-up-line-duotone" className=" fs-24 text-primary" />
                    </div>
                  </Col>
                  <Col xs={6} className="text-end">
                    <p className="text-muted mb-0 text-truncate">New User</p>
                    <h3 className="text-dark mt-1 mb-0">{dashboardData?.data?.users?.newUsers}</h3>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="overflow-hidden">
              <CardBody>
                <Row>
                  <Col xs={6}>
                    <div className="avatar-md bg-soft-primary rounded  flex-centered">
                      <IconifyIcon icon="solar:shield-user-line-duotone" className=" fs-24 text-primary" />
                    </div>
                  </Col>
                  <Col xs={6} className="text-end">
                    <p className="text-muted mb-0 text-truncate">Sub Admin</p>
                    <h3 className="text-dark mt-1 mb-0">{dashboardData?.data?.users?.totalSubAdmins}</h3>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Col>
      <Col xxl={12}>
        <Row>
          <Col xs={12}>
            <div className="alert alert-secondary text-truncate mb-3" role="alert">
              Subscriptions Active Plan And Plan Type Analytics
            </div>
          </Col>
          <Col md={4}>
            <Card className="overflow-hidden">
              <CardBody>
                <Row>
                  <Col xs={6}>
                    <div className="avatar-md bg-soft-secondary rounded  flex-centered">
                      <IconifyIcon icon="solar:planet-2-line-duotone" className=" fs-24 text-primary" />
                    </div>
                  </Col>
                  <Col xs={6} className="text-end">
                    <p className="text-muted mb-0 text-truncate">Active Plan</p>
                    <h3 className="text-dark mt-1 mb-0">{dashboardData?.data?.subscriptions?.activePlans}</h3>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="overflow-hidden">
              <CardBody>
                <Row>
                  <Col xs={6}>
                    <div className="avatar-md bg-soft-secondary rounded  flex-centered">
                      <IconifyIcon icon="solar:stopwatch-play-line-duotone" className=" fs-24 text-primary" />
                    </div>
                  </Col>
                  <Col xs={6} className="text-end">
                    <p className="text-muted mb-0 text-truncate">Watch And Earn Plan</p>
                    <h3 className="text-dark mt-1 mb-0">{dashboardData?.data?.subscriptions?.byType?.WATCH_AND_EARN_PLAN}</h3>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="overflow-hidden">
              <CardBody>
                <Row>
                  <Col xs={6}>
                    <div className="avatar-md bg-soft-secondary rounded  flex-centered">
                      <IconifyIcon icon="solar:stopwatch-play-line-duotone" className=" fs-24 text-primary" />
                    </div>
                  </Col>
                  <Col xs={6} className="text-end">
                    <p className="text-muted mb-0 text-truncate">Monthly Premium</p>
                    <h3 className="text-dark mt-1 mb-0">{dashboardData?.data?.subscriptions?.byType?.MONTHLY_PREMIUM}</h3>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="overflow-hidden">
              <CardBody>
                <Row>
                  <Col xs={6}>
                    <div className="avatar-md bg-soft-secondary rounded  flex-centered">
                      <IconifyIcon icon="solar:hand-money-line-duotone" className=" fs-24 text-primary" />
                    </div>
                  </Col>
                  <Col xs={6} className="text-end">
                    <p className="text-muted mb-0 text-truncate">Pay Per Movie Plan</p>
                    <h3 className="text-dark mt-1 mb-0">{dashboardData?.data?.subscriptions?.byType?.PAY_PER_MOVIE_PLAN}</h3>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="overflow-hidden">
              <CardBody>
                <Row>
                  <Col xs={6}>
                    <div className="avatar-md bg-soft-secondary rounded  flex-centered">
                      <IconifyIcon icon="solar:bookmark-circle-line-duotone" className=" fs-24 text-primary" />
                    </div>
                  </Col>
                  <Col xs={6} className="text-end">
                    <p className="text-muted mb-0 text-truncate">Yearly Premium Plan</p>
                    <h3 className="text-dark mt-1 mb-0">{dashboardData?.data?.subscriptions?.byType?.YEARLY_PREMIUM_PLAN}</h3>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Col>
      <Col xxl={12}>
        <Row>
          <Col xs={12}>
            <div className="alert alert-success text-truncate mb-3" role="alert">
              Revenue Analytics
            </div>
          </Col>
          <Col md={4}>
            <Card className="overflow-hidden">
              <CardBody>
                <Row>
                  <Col xs={6}>
                    <div className="avatar-md bg-soft-success rounded  flex-centered">
                      <IconifyIcon icon="solar:wallet-line-duotone" className=" fs-24 text-primary" />
                    </div>
                  </Col>
                  <Col xs={6} className="text-end">
                    <p className="text-muted mb-0 text-truncate">Revenue</p>
                    <h3 className="text-dark mt-1 mb-0">{dashboardData?.data?.revenue?.totalRevenue}</h3>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="overflow-hidden">
              <CardBody>
                <Row>
                  <Col xs={6}>
                    <div className="avatar-md bg-soft-success rounded  flex-centered">
                      <IconifyIcon icon="solar:banknote-2-line-duotone" className=" fs-24 text-primary" />
                    </div>
                  </Col>
                  <Col xs={6} className="text-end">
                    <p className="text-muted mb-0 text-truncate">Payout</p>
                    <h3 className="text-dark mt-1 mb-0">{dashboardData?.data?.revenue?.totalPayout}</h3>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="overflow-hidden">
              <CardBody>
                <Row>
                  <Col xs={6}>
                    <div className="avatar-md bg-soft-success rounded  flex-centered">
                      <IconifyIcon icon="solar:banknote-line-duotone" className=" fs-24 text-primary" />
                    </div>
                  </Col>
                  <Col xs={6} className="text-end">
                    <p className="text-muted mb-0 text-truncate">Transaction</p>
                    <h3 className="text-dark mt-1 mb-0">{dashboardData?.data?.revenue?.totalTransactions}</h3>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Col>
      <Col xxl={12}>
        <Row>
          <Col xs={12}>
            <div className="alert alert-info text-truncate mb-3" role="alert">
              Transactions Analytics
            </div>
          </Col>

          <Col md={4}>
            <Card className="overflow-hidden">
              <CardBody>
                <Row>
                  <Col xs={6}>
                    <div className="avatar-md bg-soft-info rounded  flex-centered">
                      <IconifyIcon icon="solar:banknote-line-duotone" className=" fs-24 text-primary" />
                    </div>
                  </Col>
                  <Col xs={6} className="text-end">
                    <p className="text-muted mb-0 text-truncate">Approved</p>
                    <h3 className="text-dark mt-1 mb-0">{dashboardData?.data?.transactions?.statusBreakdown?.APPROVED}</h3>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="overflow-hidden">
              <CardBody>
                <Row>
                  <Col xs={6}>
                    <div className="avatar-md bg-soft-info rounded  flex-centered">
                      <IconifyIcon icon="solar:slash-circle-line-duotone" className=" fs-24 text-primary" />
                    </div>
                  </Col>
                  <Col xs={6} className="text-end">
                    <p className="text-muted mb-0 text-truncate">Pending</p>
                    <h3 className="text-dark mt-1 mb-0">{dashboardData?.data?.transactions?.statusBreakdown?.PENDING}</h3>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Col>
      <Col xxl={12}>
        <Row>
          <Col xs={12}>
            <div className="alert alert-warning text-truncate mb-3" role="alert">
              Watch And Earn Analytics
            </div>
          </Col>
          <Col md={4}>
            <Card className="overflow-hidden">
              <CardBody>
                <Row>
                  <Col xs={6}>
                    <div className="avatar-md bg-soft-warning rounded  flex-centered">
                      <IconifyIcon icon="solar:stopwatch-play-line-duotone" className=" fs-24 text-primary" />
                    </div>
                  </Col>
                  <Col xs={6} className="text-end">
                    <p className="text-muted mb-0 text-truncate">Min. Watch</p>
                    <h3 className="text-dark mt-1 mb-0">{dashboardData?.data?.watchAndEarn?.totalMinutesWatched}</h3>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="overflow-hidden">
              <CardBody>
                <Row>
                  <Col xs={6}>
                    <div className="avatar-md bg-soft-warning rounded  flex-centered">
                      <IconifyIcon icon="solar:stopwatch-play-line-duotone" className=" fs-24 text-primary" />
                    </div>
                  </Col>
                  <Col xs={6} className="text-end">
                    <p className="text-muted mb-0 text-truncate">Hrs. Watch</p>
                    <h3 className="text-dark mt-1 mb-0">{dashboardData?.data?.watchAndEarn?.totalHoursWatched}</h3>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="overflow-hidden">
              <CardBody>
                <Row>
                  <Col xs={6}>
                    <div className="avatar-md bg-soft-warning rounded  flex-centered">
                      <IconifyIcon icon="solar:projector-line-duotone" className=" fs-24 text-primary" />
                    </div>
                  </Col>
                  <Col xs={6} className="text-end">
                    <p className="text-muted mb-0 text-truncate">Rewards Paid</p>
                    <h3 className="text-dark mt-1 mb-0">{dashboardData?.data?.watchAndEarn?.totalRewardsPaid}</h3>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Col>
      <Col xxl={12}>
        <Card>
          <CardBody>
            <div className="d-flex justify-content-between align-items-center">
              <CardTitle as={'h4'}>Daily Trends</CardTitle>
              {/* <div>
                <button type="button" className="btn btn-sm btn-outline-light">
                  ALL
                </button>
                &nbsp;
                <button type="button" className="btn btn-sm btn-outline-light">
                  1M
                </button>
                &nbsp;
                <button type="button" className="btn btn-sm btn-outline-light">
                  6M
                </button>
                &nbsp;
                <button type="button" className="btn btn-sm btn-outline-light active">
                  1Y
                </button>
              </div> */}
            </div>
            <div dir="ltr">
              <div id="dash-performance-chart" className="apex-charts" />
              <ReactApexChart options={dailyOptions} series={dailyOptions.series} height={313} type="line" className="apex-charts" />
            </div>
          </CardBody>
        </Card>
      </Col>
      <Col xxl={12}>
        <Card>
          <CardBody>
            <div className="d-flex justify-content-between align-items-center">
              <CardTitle as={'h4'}>Revenue Graph</CardTitle>
              {/* <div>
                <button type="button" className="btn btn-sm btn-outline-light">
                  ALL
                </button>
                &nbsp;
                <button type="button" className="btn btn-sm btn-outline-light">
                  1M
                </button>
                &nbsp;
                <button type="button" className="btn btn-sm btn-outline-light">
                  6M
                </button>
                &nbsp;
                <button type="button" className="btn btn-sm btn-outline-light active">
                  1Y
                </button>
              </div> */}
            </div>
            <div dir="ltr">
              <div id="dash-performance-chart" className="apex-charts" />
              <ReactApexChart options={revenueOptions} series={revenueOptions.series} height={313} type="line" className="apex-charts" />
            </div>
          </CardBody>
        </Card>
      </Col>
      <Col xxl={12}>
        <Card>
          <CardBody>
            <div className="d-flex justify-content-between align-items-center">
              <CardTitle as={'h4'}>User Growth Graph</CardTitle>
              {/* <div>
                <button type="button" className="btn btn-sm btn-outline-light">
                  ALL
                </button>
                &nbsp;
                <button type="button" className="btn btn-sm btn-outline-light">
                  1M
                </button>
                &nbsp;
                <button type="button" className="btn btn-sm btn-outline-light">
                  6M
                </button>
                &nbsp;
                <button type="button" className="btn btn-sm btn-outline-light active">
                  1Y
                </button>
              </div>*/}
            </div>
            <div dir="ltr">
              <div id="dash-performance-chart" className="apex-charts" />
              <ReactApexChart options={userOptions} series={userOptions.series} height={313} type="line" className="apex-charts" />
            </div>
          </CardBody>
        </Card>
      </Col>
    </>
  )
}
export default Stats
