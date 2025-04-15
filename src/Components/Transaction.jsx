export default function Transaction({ transactions }) {
  return (
    <>
      {transactions.map((item) => (
        <tr key={item.id}>
          <td>{item.sub_category}</td>
          <td>{item.amount.toLocaleString()}</td>
          <td>{item.description}</td>
          <td>{item.remarks ? item.remarks : ""}</td>
        </tr>
      ))}
    </>
  );
}
