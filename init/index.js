<% layout("layouts/boilerplate") %>

<style>
  #filters {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
  }
  .filter {
    text-align: center;
    margin-top: 1rem;
    margin-right: 2rem;
    opacity: 0.7;
    text-decoration: none;
    color: inherit;
  }
  .filter:hover,
  .filter.active {
    opacity: 1;
    cursor: pointer;
    border-bottom: 2px solid #ff5733;
  }
  .filter p {
    font-size: 0.8rem;
  }
  .filter .fa-solid {
    color: #ff5733;
    font-size: 24px;
  }
  .tax-info {
    display: none;
  }
  .tax-toggle {
    border: 1px solid #ccc;
    border-radius: 12px;
    height: 3.25rem;
    padding: 1rem;
    margin-left: auto;
    display: flex;
    align-items: center;
    gap: 10px;
  }
</style>

<div id="filters">
  <a href="/listings?category=Trending" class="filter <%= category === 'Trending' ? 'active' : '' %>">
    <div><i class="fa-solid fa-fire"></i></div>
    <p>Trending</p>
  </a>
  <a href="/listings?category=Rooms" class="filter <%= category === 'Rooms' ? 'active' : '' %>">
    <div><i class="fa-solid fa-bed"></i></div>
    <p>Rooms</p>
  </a>
  <a href="/listings?category=Iconic cities" class="filter <%= category === 'Iconic cities' ? 'active' : '' %>">
    <div><i class="fa-solid fa-mountain-city"></i></div>
    <p>Iconic cities</p>
  </a>
  <a href="/listings?category=Castles" class="filter <%= category === 'Castles' ? 'active' : '' %>">
    <div><i class="fa-solid fa-chess-rook"></i></div>
    <p>Castles</p>
  </a>
  <a href="/listings?category=Amazing-pools" class="filter <%= category === 'Amazing-pools' ? 'active' : '' %>">
    <div><i class="fa-solid fa-person-swimming"></i></div>
    <p>Amazing-pools</p>
  </a>
  <a href="/listings?category=Camping" class="filter <%= category === 'Camping' ? 'active' : '' %>">
    <div><i class="fa-solid fa-campground"></i></div>
    <p>Camping</p>
  </a>
  <a href="/listings?category=Farms" class="filter <%= category === 'Farms' ? 'active' : '' %>">
    <div><i class="fa-solid fa-wheat-awn"></i></div>
    <p>Farms</p>
  </a>
  <a href="/listings?category=Arctic" class="filter <%= category === 'Arctic' ? 'active' : '' %>">
    <div><i class="fa-solid fa-snowflake"></i></div>
    <p>Arctic</p>
  </a>
  <a href="/listings?category=Domes" class="filter <%= category === 'Domes' ? 'active' : '' %>">
    <div><i class="fa-solid fa-igloo"></i></div>
    <p>Domes</p>
  </a>
  <a href="/listings?category=Boat" class="filter <%= category === 'Boat' ? 'active' : '' %>">
    <div><i class="fa-solid fa-ship"></i></div>
    <p>Boat</p>
  </a>

  <div class="tax-toggle">
    <div class="form-check-reverse form-switch">
      <input class="form-check-input" type="checkbox" role="switch" id="switchCheckDefault" />
      <label class="form-check-label" for="switchCheckDefault">Display total after taxes</label>
    </div>
  </div>
</div>

<div class="row row-cols-lg-3 row-cols-md-2 row-cols-sm-1 mt-3">
  <% for (let listing of allListings) { %>
    <a href="/listings/<%= listing._id %>" class="listing-link">
      <div class="card col listing-card">
        <img src="<%= listing.image.url %>" class="card-img-top" alt="listing_image" style="height: 20rem;" />
        <div class="card-img-overlay"></div>
        <div class="card-body">
          <p class="card-text">
            <b><%= listing.title %></b>
          </p>
          <p class="card-text">
            &#8377; <%= (listing.price || 0).toLocaleString("en-IN") %> / night
            <i class="tax-info"> &nbsp; &nbsp; +18% GST</i>
          </p>
        </div>
      </div>
    </a>
  <% } %>
</div>

<script>
  const taxSwitch = document.getElementById("switchCheckDefault");
  taxSwitch.addEventListener("click", () => {
    const taxInfo = document.getElementsByClassName("tax-info");
    for (const info of taxInfo) {
      info.style.display = info.style.display !== "inline" ? "inline" : "none";
    }
  });
</script>