document.addEventListener("DOMContentLoaded", function () {
  // Fetch news from the server when the page loads

  fetchNews();
  efficiencyIndex = 0;
  setInterval(fetchNews, 5000);

  // Function to fetch and display news
  function fetchNews() {
    const bigDiv = document.querySelector(".overall"); // this is the bigger div
    var checkId = bigDiv.children[0].getAttribute("data-post-id");
    if (checkId == "youAreFlash") {
      bigDiv.innerHTML = ""; //making it empty once
    }

    fetch("/api/upload")
      .then((response) => response.json())
      .then((newsList) => {
        if (checkId != "youAreFlash") {
          newsList.forEach((newsItem, ind) => {
            if (newsItem._id == checkId) {
              // console.log("positive id at index", ind);
              efficiencyIndex = ind;
            }
          });
        }
        console.log(efficiencyIndex);

        // Iterate through the news list and display each item
        newsList.forEach((newsItem, ind) => {
          if (
            (newsItem.content != null && ind > efficiencyIndex) ||
            efficiencyIndex == 0
          ) {
            const newsDiv = document.createElement("div");
            newsDiv.className = "container"; //this is 1 message container
            newsDiv.setAttribute("data-post-id", newsItem._id);
            newsDiv.innerHTML = `<div class="row">
                          <div class="col-sm-4 col-md-11 col-lg-12" style="text-align: center; border:1px solid white; padding:10px; border-radius: 20px; margin:10px; background-color: lightgreen;    border-top:13px solid transparent; border-right:36px solid white; border-bottom:1px solid white; ">
                            <div class="news-container post1" >
                            <h3><b>${newsItem.title}</b></h3>
                            <p>${newsItem.content}</p>
                            <img src="/${
                              newsItem.image
                            }" alt="${" "} " style="width:20%;">
                            <p><b>${newsItem.time}</p>
                            <div class="post-ratings-container">
                                <div class="post-rating">
                                    <span class="post-rating-button material-icons" onclick="playSound()">thumb_up</span>
                                    <span class="post-rating-count"><input name="${
                                      "lik" + newsItem._id
                                    }" type="text" value=${
              newsItem.like
            } readonly></span>
                                </div>
                                <div class="post-rating">
                                    <span class="post-rating-button material-icons" onclick="playSound()">thumb_down</span>
                                    <span class="post-rating-count"><input name="${
                                      "dis" + newsItem._id
                                    }" type="text" value=${
              newsItem.dislike
            }  readonly></span>
                                </div>
                            </div>
                          </div>
                    `;
            document
              .querySelector(".overall")
              .insertBefore(
                newsDiv,
                document.querySelector(".overall .container:first-of-type")
              );
          } //end to the if(newsItem.content!= null)
        }); //this is the end to .forEach newsItem, hence all content loaded
      })
      .catch((error) => console.error("Error fetching news:", error));
  } //this is the bracket for fetchNews();

  //below are the brackets for DOM.contentLoaded event
});
