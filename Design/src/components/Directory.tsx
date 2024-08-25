import { useEffect, useMemo, useState, ChangeEvent, FormEvent } from "react";
import {
  useReactTable,
  flexRender,
  getCoreRowModel,
} from "@tanstack/react-table";
import "./styles/Directory.css";
import FilterAltSharpIcon from "@mui/icons-material/FilterAltSharp";
import AddSharpIcon from "@mui/icons-material/AddSharp";
import CreateSharpIcon from "@mui/icons-material/CreateSharp";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import Photo from "../Photo/mypic (2).jpg";

interface FormData {
  profileImage: string;
  name: string;
  email: string;
  role: string;
  status: string;
  teams: string;
}

interface RowData {
  profileImage: string;
  name: string;
  email: string;
  role: string;
  status: string;
  teams: string;
}

export default function Directory() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [users, setUsers] = useState<FormData[]>([]);
  const [data, setData] = useState<RowData[]>([]);
  const [panelOpen, setpanelOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<FormData | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // Fetch data from localStorage
    const storedData = localStorage.getItem("usersData");
    if (storedData) {
      setData(JSON.parse(storedData));
    }
  }, []);

  const handleImageChange = (
    e: ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setUsers((prevUsers) => {
          const updatedUsers = [...prevUsers];
          updatedUsers[index].profileImage = base64String;
          return updatedUsers;
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleViewUser = (user: FormData) => {
    setSelectedUser(user);
    setpanelOpen(true);
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    index: number
  ) => {
    const { name, value } = e.target;
    setUsers((prevUsers) => {
      const updatedUsers = [...prevUsers];
      updatedUsers[index] = {
        ...updatedUsers[index],
        [name]: value,
      };
      return updatedUsers;
    });
  };

  const handleAddUser = () => {
    setUsers([
      ...users,
      {
        profileImage: "",
        name: "",
        email: "",
        role: "",
        status: "",
        teams: "",
      },
    ]);
  };

  const handleDeleteUser = (index: number) => {
    const updatedUsers = users.filter((_, i) => i !== index);
    setUsers(updatedUsers);
    const updatedData = data.filter((_, i) => i !== index);
    setData(updatedData);
    localStorage.setItem("usersData", JSON.stringify(updatedData));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const newData = [...data, ...users];
    setData(newData);
    localStorage.setItem("usersData", JSON.stringify(newData));
    setUsers([]);
    setIsModalOpen(false);
    alert("Users added!");
  };

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredData = useMemo(() => {
    return data.filter((user) => {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      return (
        user.name.toLowerCase().includes(lowerCaseSearchTerm) ||
        user.email.toLowerCase().includes(lowerCaseSearchTerm) ||
        user.role.toLowerCase().includes(lowerCaseSearchTerm) ||
        user.status.toLowerCase().includes(lowerCaseSearchTerm) ||
        user.teams.toLowerCase().includes(lowerCaseSearchTerm)
      );
    });
  }, [data, searchTerm]);

  const columns = useMemo(
    () => [
      {
        header: "Name",
        accessorKey: "profileImage",
        cell: ({ getValue, row }: any) => (
          <div className="flex items-center" onClick={() => handleViewUser(row.original)}>
            <img
              src={getValue() || "default-image-url"}
              alt="Profile"
              className="w-10 h-10 rounded-full"
            />
            <span className="ml-2">{row.original.name}</span>
          </div>
        ),
      },
      {
        header: "Status",
        accessorKey: "status",
      },
      {
        header: "Role",
        accessorKey: "role",
      },
      {
        header: "Email Address",
        accessorKey: "email",
      },
      {
        header: "Teams",
        accessorKey: "teams",
      },
    ],
    []
  );

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="container">
      <div className="wrapper">
        <table>
          <thead>
            <tr id="table-heading">
              <th id="team">
                <span id="team-members">Team members</span>
              </th>
              <th>
                <span id="count-users">{filteredData.length} users</span>
              </th>
              <div className="right-utils">
                <input type="text" placeholder="Search" id="search" value={searchTerm} onChange={handleSearchChange}/>
                <FilterAltSharpIcon />
                <button
                  className="block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  type="button"
                  onClick={() => setIsModalOpen(true)}
                >
                  <AddSharpIcon />
                  Add Members
                </button>
              </div>
            </tr>
          </thead>
          <tbody>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id}>
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </th>
                ))}
              </tr>
            ))}
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
                <td>
                  <div className="icons">
                    <DeleteOutlineOutlinedIcon
                      onClick={() => handleDeleteUser(row.index)}
                    />
                    <CreateSharpIcon />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50"
          aria-hidden={!isModalOpen}
        >
          <div className="relative p-4 w-full max-w-2xl max-h-full bg-white rounded-lg shadow dark:bg-gray-700">
            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Add New Members
              </h3>
              <button
                type="button"
                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                onClick={() => setIsModalOpen(false)}
              >
                <svg
                  className="w-3 h-3"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 14 14"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                  />
                </svg>
                <span className="sr-only">Close modal</span>
              </button>
            </div>
            <div className="p-4 md:p-5 space-y-4">
              <form onSubmit={handleSubmit}>
                {users.map((user, index) => (
                  <div key={index} className="mb-4">
                    <div className="img">
                      <img
                        src={user.profileImage || "default-image-url"}
                        alt="User_Image"
                        className="user_image"
                      />
                    </div>
                    <div className="two-button">
                      <input
                        type="file"
                        placeholder="Change Photo"
                        accept="image/*"
                        onChange={(e) => handleImageChange(e, index)}
                        className="file-input"
                      />
                      <button
                        type="button"
                        style={{ background: "blue" }}
                        onClick={() => {
                          setUsers((prevUsers) => {
                            const updatedUsers = [...prevUsers];
                            updatedUsers[index].profileImage = "";
                            return updatedUsers;
                          });
                        }}
                      >
                        Remove Photo
                      </button>
                    </div>
                    <div className="flex space-x-4 mb-4">
                      <div className="flex-1">
                        <label
                          htmlFor={`name-${index}`}
                          className="block text-gray-700 text-sm font-bold mb-2 dark:text-gray-400"
                        >
                          Name
                        </label>
                        <input
                          type="text"
                          id={`name-${index}`}
                          value={user.name}
                          onChange={(e) => handleChange(e, index)}
                          name="name"
                          placeholder="Enter name"
                          className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none dark:bg-gray-800 dark:text-gray-400"
                        />
                      </div>
                    </div>
                    <div className="flex space-x-4 mb-4">
                      <div className="flex-1">
                        <label
                          htmlFor={`email-${index}`}
                          className="block text-gray-700 text-sm font-bold mb-2 dark:text-gray-400"
                        >
                          Email
                        </label>
                        <input
                          type="email"
                          id={`email-${index}`}
                          value={user.email}
                          onChange={(e) => handleChange(e, index)}
                          name="email"
                          placeholder="Enter email"
                          className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none dark:bg-gray-800 dark:text-gray-400"
                        />
                      </div>
                    </div>
                    <div className="flex space-x-4 mb-4">
                      <div className="flex-1">
                        <label
                          htmlFor={`role-${index}`}
                          className="block text-gray-700 text-sm font-bold mb-2 dark:text-gray-400"
                        >
                          Role
                        </label>
                        <input
                          type="text"
                          id={`role-${index}`}
                          value={user.role}
                          onChange={(e) => handleChange(e, index)}
                          name="role"
                          placeholder="Enter role"
                          className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none dark:bg-gray-800 dark:text-gray-400"
                        />
                      </div>
                      <div className="flex-1">
                        <label
                          htmlFor={`status-${index}`}
                          className="block text-gray-700 text-sm font-bold mb-2 dark:text-gray-400"
                        >
                          Status
                        </label>
                        <select
                          id={`status-${index}`}
                          value={user.status}
                          onChange={(e) => handleChange(e, index)}
                          name="status"
                          className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none dark:bg-gray-800 dark:text-gray-400"
                        >
                          <option value="">Select status</option>
                          <option value="Active">Active</option>
                          <option value="Inactive">Inactive</option>
                        </select>
                      </div>
                    </div>
                    <div className="flex space-x-4 mb-4">
                      <div className="flex-1">
                        <label
                          htmlFor={`teams-${index}`}
                          className="block text-gray-700 text-sm font-bold mb-2 dark:text-gray-400"
                        >
                          Teams
                        </label>
                        <input
                          type="text"
                          id={`teams-${index}`}
                          value={user.teams}
                          onChange={(e) => handleChange(e, index)}
                          name="teams"
                          placeholder="Enter teams"
                          className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none dark:bg-gray-800 dark:text-gray-400"
                        />
                      </div>
                    </div>
                  </div>
                ))}
                <div className="flex justify-end">
                  <button
                    type="button"
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg mr-2"
                    onClick={handleAddUser}
                  >
                    Add
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg mr-2"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    className="bg-gray-500 text-white px-4 py-2 rounded-lg"
                    onClick={() => setIsModalOpen(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      {/* modal */}
      {panelOpen && selectedUser && (
        <div className="sidepanel-container">
          <div className="panel-header">
            <div className="image">
              <img src={selectedUser.profileImage} alt="" className="profile-img" />
            </div>
            <div className="header-text">
              <h3 className="name-status">
                Manish Vishwakarma | <span className="status">Active</span>
              </h3>
              <p className="user-id-role">
                User ID: <span className="user-id">12345</span> | Role:{" "}
                <span className="role">Admin</span>
              </p>
            </div>
            <div className="close-modal" onClick={() => setpanelOpen(false)}>
              X
            </div>
          </div>
          <h1 className="personal-info">Personal Information</h1>
          <div className="credentials">
            <table>
              <tr className="table-row">
                <td>Date of Birth</td>
                <td>28-04-2024</td>
              </tr>
              <tr className="table-row">
                <td>Nationality</td>
                <td>Indian</td>
              </tr>
              <tr className="table-row">
                <td>Contact no.</td>
                <td>9179323583</td>
              </tr>
              <tr className="table-row">
                <td>E-mail Address</td>
                <td>manish@gmail.com</td>
              </tr>
              <tr className="table-row">
                <td>Work E-mail Address</td>
                <td>manish@gmail.com</td>
              </tr>
            </table>
            <div className="footer">
              <h1>Research Publication</h1>
              <h3 style={{ fontWeight: "500" }}>
                Ai and User Experience: The Future of Design
              </h3>
              <h6>Published of the journal of modern design 2022</h6>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
