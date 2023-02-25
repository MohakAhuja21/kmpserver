// importing in productController.js
class ApiFeatures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

  // search feature
  search() {
    const keyword = this.queryStr.keyword
      ? {
          name: {
            $regex: this.queryStr.keyword,
            $options: "i",
          },
        }
      : {};

    this.query = this.query.find({ ...keyword });
    return this;
  }

  // product filter // for CATEGORY
  filter() {
    const queryCopy = { ...this.queryStr };

    // removing some filed for category
    const removeFields = ["keyword", "page", "limit"];

    removeFields.forEach((key) => delete queryCopy[key]);

    // filter for price and rating
    let queryStr = JSON.stringify(queryCopy);
    // gt-> greater than
    // lt-> lower than
    // gte/lte-> lower/greater than equal to
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (key) => `$${key}`);
    // here key is getting value of gt(price) and adding a dollar($) sign in front of it.

    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }

  pagination(resultPerPage){
    const currentPage = Number(this.queryStr.page) || 1;
// matlab agar humare database mai 50 products hai and hum per page 10 products display kar rahe hai. toh next page par 10 products jo phele already display ho chuke hai unko skip karke aage ke dikhayenge.
    const skip= resultPerPage * (currentPage - 1);
// this.query= product find hai. And fir uske upar humne limit lagadi ki utni he dikhenge jitni humne set kardi hai.
    this.query=this.query.limit(resultPerPage).skip(skip)

    return this;
  }
}

module.exports = ApiFeatures;
