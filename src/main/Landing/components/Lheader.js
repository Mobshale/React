import { Button, Menu } from "antd";
import { HomeOutlined, DollarOutlined, UserOutlined } from "@ant-design/icons";

const LHeader = () => {
  return (
    <div
      style={{
        backgroundColor: "#FFFFFF",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        position: "sticky",
        top: 0,
        zIndex: 999,
        marginBottom: "20px", // Reduce the margin-bottom as needed
      }}
    >
      <div
        style={{
          width: "1200px",
          padding: "10px",
          marginLeft: "auto",
          marginRight: "auto",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ alignSelf: "flex-start", marginTop: "10px" }}>
          <h1
            style={{
              alignSelf: "flex-start",
              marginLeft: "20px",
              marginTop: "17px",
              color: "#7367f0",
              fontWeight: "900",
              fontSize: "23px",
            }}
          >
            Flames
          </h1>
        </div>

        <div style={{ alignSelf: "flex-end" }}>
          <Menu mode="horizontal" theme="light">
            <Menu.Item
              key="home"
              onClick={() => (window.location.href = "/")}
              icon={<HomeOutlined />}
            >
              Home
            </Menu.Item>
            <Menu.Item
              key="pricing"
              onClick={() => (window.location.href = "/Pricing")}
              icon={<DollarOutlined />}
            >
              Pricing
            </Menu.Item>
            <Menu.Item
              key="Start for free"
              onClick={() => (window.location.href = "/Login")}
              style={{ backgroundColor: "#E4E4E4", marginRight: "8px" }}
            >
              Login
            </Menu.Item>
            <Menu.Item
              key="Login"
              onClick={() => (window.location.href = "/Login")}
              style={{
                backgroundColor: "#854AF6",
                color: "#FFFFFF",
                marginRight: "8px",
              }}
            >
              Try for free
            </Menu.Item>
          </Menu>
        </div>
      </div>
    </div>
  );
};

export default LHeader;
