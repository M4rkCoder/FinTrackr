export default function Transaction ({ transactions }) {
    return (
          <>
          {transactions.map((item) => (
            <tr key={item.id} className="text-center">
              <td className="border border-gray-300 p-2">{item.date}</td>
              <td className="border border-gray-300 p-2">{item.sub_category}</td>
              <td className="border border-gray-300 p-2">{item.amount.toLocaleString()}원</td>
              <td className="border border-gray-300 p-2">{item.description}</td>
              <td className="border border-gray-300 p-2">
                {item.remarks ? item.remarks : "-"}
              </td>
            </tr>
          ))}
          </>
    );
  };