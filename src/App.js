import { useState } from "react";

const initialFriends = [
  {
    id: 499476,
    name: "Krish",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: -70,
  },
  {
    id: 9177529,
    name: "Aadya",
    image: "https://i.pravatar.cc/48?u=9177529",
    balance: 0,
  },
  {
    id: 6195371,
    name: "Shivani",
    image: "https://i.pravatar.cc/48?u=6195371",
    balance: 120,
  },
];

function Button({ children, onClick }) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}

export default function App() {
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [friends, setFriends] = useState(initialFriends);
  const [selectedFriend, setSelectedFriend] = useState(null);

  function handleSelection(friend) {
    if (selectedFriend?.id === friend.id) setSelectedFriend(null);
    else setSelectedFriend(friend);

    setShowAddFriend(false);
  }

  function handleAddFriend(friend) {
    setFriends([...friends, friend]);
    setShowAddFriend(false);
  }

  function handleShowAddFriend() {
    setShowAddFriend((show) => !show);
  }

  function handleSplitBill(value) {
    setFriends((friends) =>
      friends.map((friend) =>
        friend.id === selectedFriend.id
          ? { ...friend, balance: friend.balance + value }
          : friend
      )
    );

    setSelectedFriend(null);
  }

  return (
    <div className="app">
      <div className="sidebar">
        <FriendsList
          friends={friends}
          onSelection={handleSelection}
          selectedFriend={selectedFriend}
        />
        {showAddFriend && <FormAddFriend onAddFriend={handleAddFriend} />}
        <Button onClick={handleShowAddFriend}>
          {showAddFriend ? "Close" : "Add Friend"}
        </Button>
      </div>

      {selectedFriend && (
        <FormSplitBill
          selectedFriend={selectedFriend}
          handleSplitBill={handleSplitBill}
        />
      )}
    </div>
  );
}

function FriendsList({ friends, onSelection, selectedFriend }) {
  return (
    <ul>
      {friends.map((friend) => (
        <Friend
          friend={friend}
          key={friend.id}
          onSelection={onSelection}
          selectedFriend={selectedFriend}
        />
      ))}
    </ul>
  );
}

function Friend({ friend, onSelection, selectedFriend }) {
  const selected = selectedFriend?.id === friend.id;

  return (
    <li className={selected ? "selected" : ""}>
      <img src={friend.image} alt={friend.name} />
      <span>{friend.name}</span>

      {friend.balance < 0 && (
        <p className="red">
          You owe {friend.name} Rs. {Math.abs(friend.balance)}
        </p>
      )}

      {friend.balance > 0 && (
        <p className="green">
          {friend.name} owes you Rs. {Math.abs(friend.balance)}
        </p>
      )}

      {friend.balance === 0 && <p>You and {friend.name} are even.</p>}

      <Button onClick={() => onSelection(friend)}>
        {selected ? "Close" : "Select"}
      </Button>
    </li>
  );
}

function FormAddFriend({ onAddFriend }) {
  const [newFriendName, setNewFriendName] = useState("");
  const [newFriendImg, setNewFriendImg] = useState(
    "https://i.pravatar.cc/48?u="
  );

  function handleSubmit(e) {
    e.preventDefault();

    if (!newFriendName || !newFriendImg) {
      return;
    }

    const id = crypto.randomUUID();
    const friend = {
      name: newFriendName,
      image: `${newFriendImg}${id}`,
      balance: 0,
      id: id,
    };

    // console.log(friend);
    onAddFriend(friend);

    setNewFriendImg("https://i.pravatar.cc/48?u=");
    setNewFriendName("");
  }

  return (
    <form className="form-add-friend" onSubmit={handleSubmit}>
      <label>👦 Friend name</label>
      <input
        type="text"
        value={newFriendName}
        onChange={(e) => setNewFriendName(e.target.value)}
      />

      <label>📸 Image URL</label>
      <input
        type="text"
        value={newFriendImg}
        onChange={(e) => setNewFriendImg(e.target.value)}
      />

      <Button>Add</Button>
    </form>
  );
}

function FormSplitBill({ selectedFriend, handleSplitBill }) {
  const [bill, setBill] = useState("");
  const [paidByUser, setPaidByUser] = useState("");
  const paidByFriend = bill ? bill - paidByUser : "";
  const [whoIsPaying, setWhoIsPaying] = useState("user");

  function handleSubmit(e) {
    e.preventDefault();

    if (!bill || !paidByUser) return;

    const value = whoIsPaying === "user" ? paidByFriend : -paidByUser;

    handleSplitBill(value);
  }

  return (
    <form className="form-split-bill" onSubmit={handleSubmit}>
      <h2>SPLIT A BILL WITH {selectedFriend.name}</h2>

      <label>💵 Bill Value </label>
      <input
        type="text"
        value={bill}
        onChange={(e) => setBill(Number(e.target.value))}
      />

      <label>Your Expense </label>
      <input
        type="text"
        value={paidByUser}
        onChange={(e) =>
          setPaidByUser(
            Number(e.target.value) > bill ? paidByUser : Number(e.target.value)
          )
        }
      />

      <label>{selectedFriend.name}'s Expense </label>
      <input type="text" disabled value={paidByFriend} />

      <label>💳 Who is paying the bill?</label>
      <select
        value={whoIsPaying}
        onChange={(e) => setWhoIsPaying(e.target.value)}
      >
        <option value="user">You</option>
        <option value="friend">{selectedFriend.name}</option>
      </select>

      <Button>Split bill</Button>
    </form>
  );
}
