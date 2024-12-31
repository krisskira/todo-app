export type UserPageProps = {
  children?: React.ReactNode;
};

export const UserPage: React.FC<UserPageProps> = (props) => {
  return (
    <div>
      UserPage
      <div>{props.children}</div>
    </div>
  );
};
