"use client"

import {Button, Navbar, Typography} from "@material-tailwind/react";

const menuItems = [
  {
    href: "/workouts",
    title: "Workouts",
  },
  {
    href: "/exercises",
    title: "Exercises",
  }
]

const Navigation = () => (
  <Navbar className="max-w-full m-0 rounded-none border-none bg-teal-500">
    <div className="flex justify-between items-center">
      <Typography as="a" href="/" color="blue-gray" variant="h4">RepVault</Typography>
      <div>
        {menuItems.map(({href, title}) =>
          (<a key={title} href={href}><Button variant="text" ripple={false}>{title}</Button></a>)
        )}
      </div>
    </div>
  </Navbar>
)

export default Navigation;
