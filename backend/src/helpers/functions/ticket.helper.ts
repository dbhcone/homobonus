const table = (items: any[]) => {
  const tableStart = `<table border="1" style="border: 2px solid green; min-width: 500px; text-overflow: ellipsis;">`;
  const heading = `<thead>
                        <tr>
                            <th>#</th>
                            <th>Event Name</th>
                            <th>Ticket Type</th>
                            <th>Unit Price (GHS)</th>
                            <th>Qty</th>
                            <th>Sub Total (GHS)</th>
                        </tr>
                    </thead>`;
  let body = '';
  const bodyStart = '<tbody>';
  const bodyEnd = '</tbody>';

  items.map((item: any, index: number) => {
    const i = index + 1;
    const num = `<td>${i}</td>`;
    const eventName = `<td>${item.eventName}</td>`;
    const ticketType = `<td>${item.ticketType}</td>`;
    const unitPrice = `<td>${item.unitPrice}</td>`;
    const quantity = `<td>${item.quantity}</td>`;
    const subTotal = `<td>${item.subTotal}</td>`;
    body = `${body}<tr>${num}${eventName}${ticketType}${unitPrice}${quantity}${subTotal}</tr>`;
  });

  const tableEnd = `</table>`;

  const table = `
                ${tableStart}
                    ${heading}
                    ${bodyStart}
                        ${body}
                    ${bodyEnd}
                ${tableEnd}`;

  return table;
};

export default table;
