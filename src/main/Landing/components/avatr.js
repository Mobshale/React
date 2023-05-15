import { Avatar } from "antd";

const AvatarList = () => {
  const rating = 4;
  const trustedBy = 150;

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

    // Add more people as needed
  ];
  return (
    <div>
      {people.map((person, index) => (
        <Avatar
          key={person.name}
          src={person.image}
          alt={person.name}
          size={32}
          shape="circle"
          style={{
            position: "absolute",
            left: `calc((100% / ${people.length}) * ${index} - 50%)`,
            zIndex: index + 1,
            transform: "translateX(-50%)",
          }}
        />
      ))}
    </div>
  );
};

export default AvatarList;
