<?php

namespace App\Http\Controllers\Api\User;

use App\Helpers\Message;
use App\Helpers\StrCustom;
use App\Http\Controllers\Controller;
use App\Models\City;
use App\Models\District;
use App\Models\SubDistrict;
use App\Models\UserAddress;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class AddressController extends Controller
{
    public function update(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'address.name' => "required|string|between:2,40",
                'address.phone' => ["required", "regex:/(84|0[3|5|7|8|9])+([0-9]{8})\b/"],
                'address.address' => "required|max:50",
            ]);

            if ($validator->fails())
                return Message::failJson($validator->errors()->first());

            $address = UserAddress::find($request->id);
            // dd($address);

            if (!$address) return Message::failJson("Không tìm thấy địa chỉ!");

            $address->name = $request->address['name'];
            $address->phone = $request->address['phone'];
            $address->address = $request->address['address'];
            $address->save();

            return Message::successJson($address, "Cập nhật thành công");
        } catch (\Throwable $th) {
            return Message::serverError();
        }
    }

    public function view($id, Request $request)
    {
        try {
            $data = $request->user->addresses->find($id);
            $city = City::find($data->city);
            $district = District::find($data->district);
            $sub_district = SubDistrict::find($data->sub_district);
            return response()->json(['status' => 'success', 'data' => [
                'address' => $data->address,
                'name' => $data->name,
                'phone' => $data->phone,
                'id' => $data->id,
                'city' => $city,
                'district' => $district,
                'sub_district' => $sub_district
            ]]);
        } catch (\Throwable $th) {
            //throw $th;
            return Message::serverError();
        }
    }

    public function get(Request $request)
    {
        try {
            $user = $request->user;
            $data = $user->addresses;

            if ($data === null)
                throw new Exception("Không tìm thấy địa chỉ của bạn!");
            $dataFormat = [];
            foreach ($data as $key => $dt) {
                $dataFormat[$key]['id'] = $dt->id;
                $dataFormat[$key]['city'] = City::find($dt->city);
                $dataFormat[$key]['district'] = District::find($dt->district);
                $dataFormat[$key]['sub_district'] = SubDistrict::find($dt->sub_district);
                $dataFormat[$key]['address'] = $dt->address;
                $dataFormat[$key]['name'] = $dt->name;
                $dataFormat[$key]['phone'] = $dt->phone;
            }
            return Message::successJson($dataFormat, "Lấy địa chỉ thành công");
        } catch (\Throwable $e) {
            return Message::serverError($e);
        }
    }

    public function create(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => "required|string|between:2,40",
            'phone' => ["required", "regex:/(84|0[3|5|7|8|9])+([0-9]{8})\b/"],
            'address' => "required|max:50",
            'city' => 'required|max:50',
            'district' => 'required|max:50',
            'sub_district' => 'required|max:50'
        ]);

        if ($validator->fails())
            return Message::failJson($validator->errors()->first());

        if (!StrCustom::checkAddress([
            'districtId' => $request->district,
            'cityId' => $request->city,
            'subDistrictId' => $request->sub_district
        ])) return Message::failJson("Địa chỉ không hợp lệ!");

        try {

            $address = UserAddress::create([
                "user_id" => $request->user->id,
                "name" => $request->name,
                "phone" => $request->phone,
                "address" => $request->address,
                "city" => $request->city,
                "district" => $request->district,
                "sub_district" => $request->sub_district
            ]);

            return Message::success("Thêm địa chỉ thành công");
        } catch (\Throwable $th) {
            return $th;
            return Message::serverError();
        }
    }

    public static function getListCities()
    {
        try {
            $response = City::all();

            return $response;
        } catch (\Throwable $th) {
            return Message::serverError();
        }
    }

    public static function getListDistricts(string $cityId)
    {
        try {
            $response = City::find($cityId);
            if (!$response) return Message::serverError();
            return $response->districts;
        } catch (\Throwable $th) {
            return Message::serverError();
        }
    }

    public static function getListWards(string $districtId)
    {
        try {
            $response = District::find($districtId);
            if (!$response) return Message::serverError();

            return $response->subDistricts;
        } catch (\Throwable $th) {
            return Message::serverError();
        }
    }

    public function start(Request $request)
    {
        return response()->json(['data' => $request->ip(), 'device' => $request->device]);
    }

    public function delete(Request $request)
    {
        try {
            $address = $request->user->addresses->find($request->addressId);
            if (!$address) return Message::successJson(['a' => $address], "Không tìm thấy address");
            $address->delete();

            return Message::success("Xóa thành công!");
        } catch (\Throwable $th) {
            return Message::serverError();
        }
    }
}