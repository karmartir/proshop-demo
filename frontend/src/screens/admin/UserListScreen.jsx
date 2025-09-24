import { LinkContainer } from "react-router-bootstrap";
import { Table, Button } from "react-bootstrap";
import { FaTimes, FaTrash, FaEdit, FaCheck} from "react-icons/fa";
import { useGetUsersQuery } from "../../slices/usersApiSlice";
import Message from "../../components/Message";
import Loader from "../../components/Loader";

const UserListScreen = () => {
  const { data: users, refetch, isLoading, error } = useGetUsersQuery();


  const deleteHandler = async (id) => {
    if (window.confirm("Are you sure to delete this user?")) {
      // Dispatch delete action here
      console.log(`Delete user with id: ${id}`);
    }
  };

  return (
    <>
      <h1>Users</h1>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <Table striped hover responsive className="table-sm">
          <thead>
            <tr>
              <th>#</th>
              <th>ID</th>
              <th>NAME</th>
              <th>EMAIL</th>
              <th>ADMIN</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={user._id}>
                <td>{index + 1}</td>
                <td>{user._id}</td>
                <td>{user.name}</td>
                <td><a href={`mailto:${user.email}`}>{user.email}</a></td>
                <td>
                  {user.isAdmin ? (
                    <FaCheck color="green" />
                  ) : (
                    <FaTimes color="red" />
                  )}
                </td>
              
                <td>
                  <LinkContainer to={`admin/user/${user._id}/edit`}>
                    <Button variant="dark" className="btn-sm me-3 text-white">
                      <FaEdit />
                    </Button>
                  </LinkContainer>

                    <Button variant="danger" className="btn-sm text-white" onClick={() => deleteHandler(user._id)}>
                      <FaTrash />
                    </Button>
                
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  );
};

export default UserListScreen;
