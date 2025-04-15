export default function Transaction({ transactions }) {
  return (
    <>
      {transactions.map((item) => (
        <tr key={item.id}>
          <td>{item.date}</td>
          <td>{item.sub_category}</td>
          <td>{item.amount.toLocaleString()}원</td>
          <td>{item.description}</td>
          <td>{item.remarks ? item.remarks : ""}</td>
          <td hidden>편집Icon</td>
        </tr>
      ))}
    </>
  );
}
