import React, { useEffect, useState } from 'react';

interface Student {
  id?: number;
  name: string;
  phone: string;
  email: string;
}

function App() {
  const [students, setStudents] = useState<Student[]>([]);
  const [formData, setFormData] = useState<Student>({ name: '', phone: '', email: '' });
  const [editId, setEditId] = useState<number | null>(null);

  

  const fetchStudents = () => {
    fetch("http://localhost:3000/")
      .then((res) => res.json())
      .then((data) => setStudents(data))
      .catch((err) => console.log(err));
  }

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const url = editId ? `http://localhost:3000/student/${editId}` : "http://localhost:3000/student";
    const method = editId ? 'PUT' : 'POST';

    fetch(url, {
      method: method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    }).then(() => {
      fetchStudents();
      setFormData({ name: '', phone: '', email: '' });
      setEditId(null);
    });
  };

  const handleDelete = (id: number) => {
    fetch(`http://localhost:3000/student/${id}`, { method: 'DELETE' })
      .then(() => fetchStudents());
  };

  const handleEdit = (student: Student) => {
    setFormData({ name: student.name, phone: student.phone, email: student.email });
    setEditId(student.id || null);
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h2>Student Management System</h2>
      
      {/* Form Section */}
      <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
        <input placeholder="Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
        <input placeholder="Phone" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} required />
        <input placeholder="Email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required />
        <button type="submit">{editId ? 'Update' : 'Add'} Student</button>
        {editId && <button onClick={() => {setEditId(null); setFormData({name:'', phone:'', email:''})}}>Cancel</button>}
      </form>

      {/* Table Section */}
      <table border={1} cellPadding="10" style={{ width: "100%", textAlign: "left", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ backgroundColor: "#ffc0cb" }}>
            <th>ID</th><th>Name</th><th>Phone</th><th>Email</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map((s) => (
            <tr key={s.id}>
              <td>{s.id}</td>
              <td>{s.name}</td>
              <td>{s.phone}</td>
              <td>{s.email}</td>
              <td>
                <button onClick={() => handleEdit(s)}>Edit</button>
                <button onClick={() => s.id && handleDelete(s.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;