const { isValidObjectId } = require("mongoose");
const { TagBlog } = require("../../models");
const { getDateTime } = require("../../helpers/getDateTime");

class TagBlogServices {
  async getTags(select = null, query = {}) {
    const tags = await TagBlog.find({ ...query, isDeleted: false })
      .select({ ...select })
      .lean();

    return tags;
  }

  async getTagsWithPage(pageSize, currentPage, select = null, query = {}) {
    const tags = await TagBlog.find({ ...query, isDeleted: false })
      .skip((currentPage - 1) * pageSize)
      .limit(pageSize)
      .select({ ...select })
      .lean();

    return tags;
  }

  async getTag(tag_id) {
    if (!tag_id || !isValidObjectId(tag_id)) return;

    const tag = await TagBlog.findById({ _id: tag_id }).lean();

    return tag;
  }

  async getTagBySlug(slug) {
    if (!slug) return;

    const tag = await TagBlog.findOne({ slug }).lean();

    return tag;
  }

  async searchTextItems(text, query = {}) {
    const totalItems = await TagBlog.find({
      ...query,
      $text: {
        $search: text,
      },
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
    const tags = await TagBlog.find({
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
      .skip((currentPage - 1) * pageSize)
      .limit(pageSize)
      .select({ ...select });
    return tags;
  }

  async createTag(data) {
    if (!data) return;

    const tag = await TagBlog.create({ ...data });

    return tag;
  }

  async updateTag(id, payload) {
    if (!id || !isValidObjectId(id)) {
      return null;
    }

    const date = getDateTime();

    const tag = await TagBlog.findByIdAndUpdate(
      { _id: id },
      {
        $set: { ...payload, updatedAt: date },
      },
      { upsert: true }
    );

    return tag;
  }

  async deleteTag(id) {
    if (!id || !isValidObjectId(id)) {
      return null;
    }

    const date = getDateTime();

    const tag = await TagBlog.findById(
      { _id: id },
      {
        $set: { isDeleted: true, updatedAt: date },
      },
      { upsert: true }
    );

    return tag;
  }
}

module.exports = new TagBlogServices();
