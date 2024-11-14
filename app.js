document.addEventListener("DOMContentLoaded", () => {
  const inventoryForm = document.getElementById("inventory-form");
  const inventoryList = document.getElementById("inventory-list");
  const categoryFilter = document.getElementById("category-filter");
  const categories = {};

  inventoryForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const teamName = document.getElementById("team-name").value;
    const country = document.getElementById("country").value;
    const year = document.getElementById("year").value;
    const imageInput = document.getElementById("image");
    const imageUrl = URL.createObjectURL(imageInput.files[0]);
    const shirtType = document.querySelector('input[name="shirt-type"]:checked').value;

    let categoryName = teamName.toLowerCase() === "seleccion" ? country : teamName;

    if (!categories[categoryName]) {
      categories[categoryName] = [];
      addCategoryToFilter(categoryName);
    }

    const shirtItem = {
      team: teamName,
      type: shirtType,
      country: country,
      year: year,
      image: imageUrl
    };
    categories[categoryName].push(shirtItem);

    displayInventory();
    inventoryForm.reset();
  });

  function displayInventory() {
    const selectedCategory = categoryFilter.value;
    inventoryList.innerHTML = "";

    for (const [category, shirts] of Object.entries(categories)) {
      if (selectedCategory !== "all" && selectedCategory !== category) {
        continue;
      }

      shirts.forEach((shirt) => {
        const listItem = document.createElement("div");
        listItem.classList.add("inventory-item");
        listItem.innerHTML = `
          <button class="delete-button">&times;</button>
          <img src="${shirt.image}" alt="Imagen de ${shirt.team}">
          <strong>Equipo:</strong> ${shirt.team} <br>
          <strong>Tipo:</strong> ${shirt.type} <br>
          <strong>País:</strong> ${shirt.country} <br>
          <strong>Año:</strong> ${shirt.year}
        `;

        const deleteButton = listItem.querySelector(".delete-button");
        deleteButton.addEventListener("click", () => {
          removeShirtFromCategory(category, shirt);
        });

        inventoryList.appendChild(listItem);
      });
    }
  }

  function addCategoryToFilter(category) {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  }

  function removeShirtFromCategory(category, shirt) {
    categories[category] = categories[category].filter(item => item !== shirt);
    if (categories[category].length === 0) {
      delete categories[category];
      removeCategoryFromFilter(category);
    }
    displayInventory();
  }

  function removeCategoryFromFilter(category) {
    const options = categoryFilter.querySelectorAll("option");
    options.forEach(option => {
      if (option.value === category) {
        option.remove();
      }
    });
  }

  categoryFilter.addEventListener("change", displayInventory);
});
