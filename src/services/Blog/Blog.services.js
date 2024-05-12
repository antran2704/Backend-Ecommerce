const { isValidObjectId } = require("mongoose");
const { Blog } = require("../../models");
const { getDateTime } = require("../../helpers/getDateTime");

class BlogServices {
  async getBlogs(select = null, query = {}) {
    const blogs = await Blog.find({ ...query, isDeleted: false })
      .select({ ...select })
      .lean();

    return blogs;
  }

  async getBlogsWithPage(pageSize, currentPage, select = null, query = {}) {
    const blogs = await Blog.find({ ...query, isDeleted: false })
      .skip((currentPage - 1) * pageSize)
      .limit(pageSize)
      .select({ ...select })
      .populate("author", {
        _id: 1,
        name: 1,
      })
      .populate("tags", {
        _id: 1,
        title: 1,
        slug: 1,
      })
      .lean();

    return blogs;
  }

  async getBlog(blog_id) {
    if (!blog_id || !isValidObjectId(blog_id)) return;

    const blog = await Blog.findById({ _id: blog_id })
      .populate("author", {
        _id: 1,
        name: 1,
      })
      .populate("tags", {
        _id: 1,
        title: 1,
        slug: 1,
      })
      .lean();

    return blog;
  }

  async getBlogBySlug(slug) {
    if (!slug) return;

    const blog = await Blog.findOne({ slug })
      .populate("author", {
        _id: 1,
        name: 1,
      })
      .populate("tags", {
        _id: 1,
        title: 1,
        slug: 1,
      })
      .lean();

    return blog;
  }

  async searchTextItems(text, query = {}) {
    const totalItems = await Blog.find({
      ...query,
      $or: [
        {
          $text: {
            $search: text,
          },
        },
        { title: { $regex: text, $options: "ui" } },
      ],
      isDeleted: false,
    });
    return totalItems;
  }

  async searchTextWithPage(
    text,
    pageSize,
    currentPage,
    query = {},
    select = null
  ) {
    const blogs = await Blog.find({
      ...query,
      $or: [
        {
          $text: {
            $search: text,
          },
        },
        { title: { $regex: text, $options: "ui" } },
      ],
      isDeleted: false,
    })
      .populate("author", {
        _id: 1,
        name: 1,
      })
      .populate("tags", {
        _id: 1,
        title: 1,
        slug: 1,
      })
      .skip((currentPage - 1) * pageSize)
      .limit(pageSize)
      .select({ ...select });
    return blogs;
  }

  async createBlog(data) {
    if (!data) return;

    const blog = await Blog.create({ ...data });

    return blog;
  }

  async updateBlog(id, payload) {
    if (!id || !isValidObjectId(id)) {
      return null;
    }

    const date = getDateTime();

    const blog = await Blog.findByIdAndUpdate(
      { _id: id },
      {
        $set: { ...payload, updatedAt: date },
      },
      { upsert: true }
    );

    return blog;
  }

  async deleteBlog(id) {
    if (!id || !isValidObjectId(id)) {
      return null;
    }

    const date = getDateTime();

    const blog = await Blog.findByIdAndUpdate(
      { _id: id },
      {
        $set: { isDeleted: true, updatedAt: date },
      },
      { upsert: true }
    );

    return blog;
  }
}

module.exports = new BlogServices();
