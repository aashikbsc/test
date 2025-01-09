import { formateDateMunite } from "common";
import moment from "moment";
import Link from "next/link";
import React from "react";

const BlogCard = ({ blog }: any) => {
  return (
    <>
      <Link href={"/blog/" + blog?.post_id}>
        <a>
          <div className="blogCard shadow-sm rounded card h-full overflow-hidden min-h-370">
            <img
              className="rounded h-full max-h-245"
              src={blog?.thumbnail}
              alt="Card image cap"
            />
            <div className="newsCardText p-4 ">
              <h4 className="titleText">{blog?.title}</h4>
              <p className="pt-2 leading-18">
                {" "}
                {blog?.description?.length > 100
                  ? `${blog?.description.slice(0, 100)}...`
                  : blog?.description}
              </p>
              <p>
                <small>{formateDateMunite(blog?.created_at)}</small>
              </p>
            </div>
          </div>
        </a>
      </Link>
    </>
  );
};

export default BlogCard;
