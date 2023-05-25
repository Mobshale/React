import { Button, Card, Col, Row } from "antd";
import { PlayCircleOutlined, ShoppingCartOutlined } from "@ant-design/icons";

const Price = () => {
  return (
    <div style={{ background: "#F0F2F5", padding: "40px 0" }}>
      <Row gutter={[16, 16]} justify="center">
        <Col xs={24} sm={12} md={8}>
          <Card
            style={{
              borderRadius: "10px",
              textAlign: "center",
              boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.15)",
            }}
            cover={
              <div
                style={{
                  height: "200px",
                  backgroundColor: "#fff",
                  borderRadius: "10px 10px 0 0",
                }}
              />
            }
          >
            <h2>Basic Plan</h2>
            <p>$9.99/month</p>
            <ul>
              <li>Feature 1</li>
              <li>Feature 2</li>
              <li>Feature 3</li>
              <li>Feature 4</li>
            </ul>
            <Button type="primary" icon={<PlayCircleOutlined />} block>
              Try Now
            </Button>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card
            style={{
              borderRadius: "10px",
              textAlign: "center",
              boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.15)",
            }}
            cover={
              <div
                style={{
                  height: "200px",
                  backgroundColor: "#fff",
                  borderRadius: "10px 10px 0 0",
                }}
              />
            }
          >
            <h2>Premium Plan</h2>
            <p>$19.99/month</p>
            <ul>
              <li>Feature 1</li>
              <li>Feature 2</li>
              <li>Feature 3</li>
              <li>Feature 4</li>
              <li>Feature 5</li>
            </ul>
            <Button type="primary" icon={<PlayCircleOutlined />} block>
              Try Now
            </Button>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card
            style={{
              borderRadius: "10px",
              textAlign: "center",
              boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.15)",
            }}
            cover={
              <div
                style={{
                  height: "200px",
                  backgroundColor: "#fff",
                  borderRadius: "10px 10px 0 0",
                }}
              />
            }
          >
            <h2>Enterprise Plan</h2>
            <p>$29.99/month</p>
            <ul>
              <li>Feature 1</li>
              <li>Feature 2</li>
              <li>Feature 3</li>
              <li>Feature 4</li>
              <li>Feature 5</li>
              <li>Feature 6</li>
            </ul>
            <Button type="primary" icon={<ShoppingCartOutlined />} block>
              Subscribe
            </Button>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Price;
