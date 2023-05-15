import { StarFilled } from "@ant-design/icons";
import { Avatar, Typography } from "antd";
import "./rating.css";

const { Text } = Typography;

const rating = 4;
const trustedBy = 150;

const people = [
  // People data here
];

const RatingDiv = () => {
  const people = [
    {
      name: "John",
      image:
        "https://ph-avatars.imgix.net/3706816/84cc4ef1-d91c-4d40-99aa-a00ad094d6fe?auto=compress&codec=mozjpeg&cs=strip&auto=format&w=36&h=36&fit=crop&dpr=1",
    },
    {
      name: "John",
      image:
        "https://ph-avatars.imgix.net/3339082/original?auto=compress&codec=mozjpeg&cs=strip&auto=format&w=36&h=36&fit=crop&dpr=1",
    },
    {
      name: "John",
      image:
        "https://ph-avatars.imgix.net/105600/1b2f2e5c-2281-4acb-9777-3870f97e90e8?auto=compress&codec=mozjpeg&cs=strip&auto=format&w=36&h=36&fit=crop&dpr=1",
    },
    {
      name: "John",
      image:
        "https://ph-avatars.imgix.net/3259959/469bf616-bc06-424f-86d6-810c0a18e635?auto=compress&codec=mozjpeg&cs=strip&auto=format&w=36&h=36&fit=crop&dpr=1",
    },
  ];

  return (
    <div className="rating-div">
      <div
        className="rating-wrapper"
        style={{
          position: "relative",
          marginRight: "35px",
          marginTop: "-25px",
        }}
      >
        {people.map((person, index) => (
          <Avatar
            key={person.name}
            src={person.image}
            alt={person.name}
            size={32}
            shape="circle"
            style={{
              position: "absolute",
              left: `${(people.length - index - 1) * 50}%`,
              zIndex: index + 1,
              transform: `translateX(-${(people.length - index - 1) * 50}%)`,
            }}
          />
        ))}
      </div>
      <div
        style={{ position: "relative", marginRight: "8px", marginTop: "auto" }}
      >
        {Array.from({ length: rating }).map((_, index) => (
          <StarFilled key={index} style={{ color: "#FFD700" }} />
        ))}
      </div>
      <Text style={{ color: "#FFFFFF" }}>Trusted by {trustedBy}+ people</Text>
    </div>
  );
};

export default RatingDiv;
