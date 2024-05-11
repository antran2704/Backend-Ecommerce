const { BlogServices, TagBlogServices } = require("../../services");

const {
  InternalServerError,
  NotFoundError,
  BadResquestError,
} = require("../../helpers/errorResponse");

const {
  GetResponse,
  CreatedResponse,
} = require("../../helpers/successResponse");
const { removeUndefindedObj } = require("../../helpers/NestedObjectParse");
const { isValidObjectId } = require("mongoose");
const getSelect = require("../../helpers/getSelect");

const AdminBlogController = {
  getBlogs: async (req, res) => {
    try {
      const select = {
        title: 1,
        thumbnail: 1,
        slug: 1,
        shortDescription: 1,
        tag: 1,
      };
      const blogs = await BlogServices.getBlogs(select);

      return new GetResponse(200, blogs).send(res);
    } catch (error) {
      return new InternalServerError().send(res);
    }
  },
  getBlogsWithPage: async (req, res) => {
    const PAGE_SIZE = Number(process.env.PAGE_SIZE) || 16;
    const currentPage = req.query.page ? Number(req.query.page) : 1;

    const select = {
      title: 1,
      thumbnail: 1,
      slug: 1,
      shortDescription: 1,
      tag: 1,
    };

    try {
      const totalItems = await BlogServices.getBlogs(select);

      const banners = await BlogServices.getBlogsWithPage(
        PAGE_SIZE,
        currentPage,
        select
      );

      return new GetResponse(200, banners).send(res, {
        pagination: {
          totalItems: totalItems.length,
          currentPage,
          pageSize: PAGE_SIZE,
        },
      });
    } catch (error) {
      return new InternalServerError().send(res);
    }
  },
  getTagsWithPage: async (req, res) => {
    const PAGE_SIZE = Number(process.env.PAGE_SIZE) || 16;
    const currentPage = req.query.page ? Number(req.query.page) : 1;

    const select = {
      title: 1,
      thumbnail: 1,
      slug: 1,
    };

    try {
      const totalItems = await TagBlogServices.getTags(select);

      const tags = await TagBlogServices.getTagsWithPage(
        PAGE_SIZE,
        currentPage,
        select
      );

      return new GetResponse(200, tags).send(res, {
        pagination: {
          totalItems: totalItems.length,
          currentPage,
          pageSize: PAGE_SIZE,
        },
      });
    } catch (error) {
      return new InternalServerError().send(res);
    }
  },
  uploadImage: async (req, res) => {
    const image = req.file.path;
    return new CreatedResponse(201, image).send(res);
  },
  getBlog: async (req, res) => {
    const { slug } = req.params;

    if (!slug) {
      return new BadResquestError().send(res);
    }

    try {
      const blog = await BlogServices.getBlogBySlug(slug);
      if (!blog || blog.isDeleted) {
        return new NotFoundError(404, "Not found blog").send(res);
      }

      return new GetResponse(200, blog).send(res);
    } catch (error) {
      return new InternalServerError().send(res);
    }
  },
  getTag: async (req, res) => {
    const { slug } = req.params;

    if (!slug) {
      return new BadResquestError().send(res);
    }

    try {
      const tag = await TagBlogServices.getTagBySlug(slug);
      if (!tag || tag.isDeleted) {
        return new NotFoundError(404, "Not found tag blog").send(res);
      }

      return new GetResponse(200, tag).send(res);
    } catch (error) {
      return new InternalServerError().send(res);
    }
  },
  getBlogById: async (req, res) => {
    const { id } = req.params;

    if (!id || !isValidObjectId(id)) {
      return new BadResquestError().send(res);
    }

    try {
      const blog = await BlogServices.getBlog(id);
      if (!blog || blog.isDeleted) {
        return new NotFoundError(404, "Not found blog").send(res);
      }

      return new GetResponse(200, blog).send(res);
    } catch (error) {
      return new InternalServerError().send(res);
    }
  },
  getTagById: async (req, res) => {
    const { id } = req.params;

    if (!id || !isValidObjectId(id)) {
      return new BadResquestError().send(res);
    }

    try {
      const tag = await TagBlogServices.getTag(id);
      if (!tag || tag.isDeleted) {
        return new NotFoundError(404, "Not found tag").send(res);
      }

      return new GetResponse(200, tag).send(res);
    } catch (error) {
      return new InternalServerError().send(res);
    }
  },
  createBlog: async (req, res) => {
    const payload = req.body;

    if (!payload) {
      return new BadResquestError().send(res);
    }

    const payloadParse = removeUndefindedObj(payload);

    try {
      const blog = await BlogServices.createBlog(payloadParse);

      if (!blog) {
        return new BadResquestError(400, "Create blog failed").send(res);
      }

      return new CreatedResponse(201, blog).send(res);
    } catch (error) {
      return new InternalServerError().send(res);
    }
  },
  createTag: async (req, res) => {
    const payload = req.body;

    if (!payload) {
      return new BadResquestError().send(res);
    }

    const payloadParse = removeUndefindedObj(payload);

    try {
      const tag = await TagBlogServices.createTag(payloadParse);

      if (!tag) {
        return new BadResquestError(400, "Create tag failed").send(res);
      }

      return new CreatedResponse(201, tag).send(res);
    } catch (error) {
      return new InternalServerError().send(res);
    }
  },
  updateBlog: async (req, res) => {
    const { id } = req.params;
    const payload = req.body;

    if (!id || !isValidObjectId(id) || !payload) {
      return new BadResquestError().send(res);
    }

    const payloadParse = removeUndefindedObj(payload);

    try {
      const blog = await BlogServices.updateBlog(id, payloadParse);
      if (!blog) {
        return new BadResquestError(400, "Update blog failed");
      }

      return new CreatedResponse(201, blog).send(res);
    } catch (error) {
      return new InternalServerError().send(res);
    }
  },
  updateTag: async (req, res) => {
    const { id } = req.params;
    const payload = req.body;

    if (!id || !isValidObjectId(id) || !payload) {
      return new BadResquestError().send(res);
    }

    const payloadParse = removeUndefindedObj(payload);

    try {
      const tag = await TagBlogServices.updateTag(id, payloadParse);
      if (!tag) {
        return new BadResquestError(400, "Update tag failed");
      }

      return new CreatedResponse(201, tag).send(res);
    } catch (error) {
      return new InternalServerError().send(res);
    }
  },
  // [SEARCH BLOG]
  searchBlog: async (req, res) => {
    const { search, tag, page, limit } = req.query;
    const PAGE_SIZE = Number(process.env.PAGE_SIZE) || 16;
    const currentPage = page ? Number(page) : 1;
    const limitQuery = limit ? Number(limit) : PAGE_SIZE;

    const select = getSelect(req.query);

    let query = {};

    if (tag) {
      query = { tags: { $in: [tag] } };
    }

    try {
      const totalItems = await BlogServices.searchTextItems(search, query);

      const blogs = await BlogServices.searchTextWithPage(
        search,
        limitQuery,
        currentPage,
        query,
        select
      );

      return new GetResponse(200, blogs).send(res, {
        pagination: {
          totalItems: totalItems.length,
          currentPage,
          pageSize: limitQuery,
        },
      });
    } catch (error) {
      return new InternalServerError(error.stack).send(res);
    }
  },
  // [SEARCH TAG BLOG]
  searchTag: async (req, res) => {
    const { search, page, limit } = req.query;
    const PAGE_SIZE = Number(process.env.PAGE_SIZE) || 16;
    const currentPage = page ? Number(page) : 1;
    const limitQuery = limit ? Number(limit) : PAGE_SIZE;

    const select = getSelect(req.query, ["search"]);
    let query = {}; 
    
    try {
      const totalItems = await TagBlogServices.searchTextItems(search, query);

      const tags = await TagBlogServices.searchTextWithPage(
        search,
        limitQuery,
        currentPage,
        query,
        select
      );

      return new GetResponse(200, tags).send(res, {
        pagination: {
          totalItems: totalItems.length,
          currentPage,
          pageSize: limitQuery,
        },
      });
    } catch (error) {
      return new InternalServerError(error.stack).send(res);
    }
  },
  deleteBlog: async (req, res) => {
    const { id } = req.params;
    if (!id || !isValidObjectId(id)) {
      return new BadResquestError().send(res);
    }

    try {
      const blog = await BlogServices.deleteBlog(id);

      if (!blog) {
        return new BadResquestError(400, "Delete blog failed").send(res);
      }

      return new CreatedResponse(201, blog).send(res);
    } catch (error) {
      return new InternalServerError().send(res);
    }
  },
  deleteTag: async (req, res) => {
    const { id } = req.params;
    if (!id || !isValidObjectId(id)) {
      return new BadResquestError().send(res);
    }

    try {
      const tag = await TagBlogServices.deleteTag(id);

      if (!tag) {
        return new BadResquestError(400, "Delete tag failed").send(res);
      }

      return new CreatedResponse(201, tag).send(res);
    } catch (error) {
      return new InternalServerError().send(res);
    }
  },
};

module.exports = AdminBlogController;
