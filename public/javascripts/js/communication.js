<script>
$(document).ready(async () => {
    await getAllCategories();
    await getAllImages();
    console.log('ready')
  });
  getAllCategories = async () => {
    try {
      const resCategories = await fetch('https://mostfeel.site:8888/admin/category/list', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      let json = await resCategories.json();
      if (resCategories.ok) {
        var data_filter_list = document.getElementById('data-filter-list');
        for (var i = 0; i < json.length; i++) {
          var newLi = document.createElement('li');
          var textNode = document.createTextNode(json[i].category_name);
          newLi.setAttribute("class", "nav-filter");
          newLi.setAttribute("data-filter", "." + json[i].category_seq);
          newLi.appendChild(textNode);
          data_filter_list.append(newLi)
        }
        return true;
      }
    } catch (err) {
      console.log(err);
      alert('카테고리를 불러오는데 실패하였습니다.');
    }
  }
  getAllImages = async () => {
    try {
      let response = await fetch('https://mostfeel.site:8888/admin/itemimages', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      let json = await response.json();
      if (response.ok) {
        var items_padding = document.getElementById('image-list');
        var parentDiv = document.createElement('div');
        parentDiv.setAttribute("class", "portfolio-wrap grid items-4 items-padding");
        parentDiv.style = "position : relative; height : 1000px;s"
        items_padding.appendChild(parentDiv);
        for (var i = 0; i < json.length; i++) {
          var newDiv = document.createElement('div');
          var rowCnt = parseInt(i / 4);
          var colCnt = i % 4;
          var styleString = "position : absolute; left : " + colCnt * 280 + "px; top : " + rowCnt * 265 + "px;"
          newDiv.setAttribute("class", `"portfolio-card isotope-item ` + json[i].category_seq + `"`);
          newDiv.style = styleString;
          var data = `<div class="portfolio-card-body">
              <div class="portfolio-card-header"> <img
                  src="`+ json[i].uri + `" alt="" width="200" height="200"> </div>
              <div class="portfolio-card-footer"> <a class="full-screen"
                  href="`+ json[i].uri + `" 
                  data-fancybox="portfolio" data-caption="aperiam sorem"><i class="fas fa-compress"></i></a>
                <h6 class="info-title"><a href="#" title="">aperiam sorem</a></h6>
                <p>Branding, Watch</p>
              </div>
            </div>`
            newDiv.innerHTML = data;
            parentDiv.appendChild(newDiv);
        }
        return true;
      }
    } catch (err) {
      console.log(err);
    }
  }
  </script>