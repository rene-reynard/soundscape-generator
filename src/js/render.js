export default function renderTemplate(container, data) {
  let dataEntries = Object.entries(data);

  let items = dataEntries.map(([key, value]) => {
    return `
      <li class="main-section__data-li">
        <div class="main-section__data-key">${key}</div>
        <div class="main-section__data-value">${value}</div>
      </li>
    `
  })

  container.innerHTML = `
    <ul class="main-section__data-ul">
      ${items.join('')}
    </ul>`
}