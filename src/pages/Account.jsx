import React from 'react'
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function Account() {
  return (
    <div className="">
      <div className="flex items-center justiy-center">
        <h1 className="font-bold md:text-3xl text-lg ">Checkout</h1>
      </div>
      <div>
        <p>Shipping Information</p>
      </div>
      <div>
        <form className="flex flex-col gap-4">
          <div className="flex flex-col ">
            <Label htmlFor="email">Email Address</Label>
            <Input
              type="email"
              id="email"
              placeholder="john@gmail.com"
              className="w-1/2 px-4 py-2 border mb-6 rounded-md"
              required
            />
            <div className="flex gap-12">
              <div>
                <Label htmlFor="email" className="w-1/2">
                  First Name{" "}
                </Label>
                <Input
                  type="text"
                  id="name"
                  placeholder="John"
                  className="w-full  py-2 border  mb-6 px-16 rounded-md"
                  required
                />
              </div>
              <div>
                <Label htmlFor="address" className="w-1/2">
                  Address
                </Label>
                <Input
                  type="text"
                  id="address"
                  placeholder="123 Main St"
                  className="w-full  py-2 border  mb-6  px-16  rounded-md"
                  required
                />
              </div>
            </div>
            <Label htmlFor="address" className="w-1/2">
              City
            </Label>
            <Input
              type="text"
              id="city"
              placeholder="Anytown"
              className="w-1/2 px-4 py-2 border  mb-6  rounded-md"
              required
            />
          </div>
        </form>
      </div>
    </div>
  );
}

export default Account